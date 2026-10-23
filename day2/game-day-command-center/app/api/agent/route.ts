/**
 * POST /api/agent  { messages: [{ role: "user" | "assistant", text: string }] }
 *
 * Calls the Day 2 Cortex Agent through SNOWFLAKE.CORTEX.DATA_AGENT_RUN. The request body is passed
 * as a bind parameter, so user text is never concatenated into SQL. Running inside Snowflake means
 * no PAT is needed; this is the same agent you call over REST and MCP.
 */
import { querySnowflakeLongRunning } from "@/lib/snowflake"
import { AGENT } from "@/lib/semantic"

export const dynamic = "force-dynamic"

type ChatMessage = { role: "user" | "assistant"; text: string }

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] }
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages is required" }, { status: 400 })
    }
    const body = JSON.stringify({
      messages: messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: [{ type: "text", text: String(m.text).slice(0, 4000) }],
      })),
    })

    const rows = await querySnowflakeLongRunning(
      "SELECT SNOWFLAKE.CORTEX.DATA_AGENT_RUN(?, ?) AS RESP",
      { binds: [AGENT, body] },
    )
    const raw = rows[0]?.RESP
    const resp = typeof raw === "string" ? JSON.parse(raw) : raw ?? {}

    const tools: string[] = []
    const sql: string[] = []
    const text: string[] = []
    for (const item of resp.content ?? []) {
      if (item.type === "tool_use" && item.tool_use?.name) tools.push(item.tool_use.name)
      if (item.type === "tool_result") {
        for (const c of item.tool_result?.content ?? []) {
          if (c?.json?.sql) sql.push(String(c.json.sql))
        }
      }
      if (item.type === "text" && item.text?.trim()) text.push(item.text.trim())
    }

    return Response.json({
      answer: text.join("\n\n") || "The agent returned no text.",
      tools: Array.from(new Set(tools)),
      sql,
    })
  } catch (e) {
    console.error(new Date().toISOString(), "[agent] failed", e)
    return Response.json({ error: e instanceof Error ? e.message : "Agent call failed" }, { status: 500 })
  }
}
