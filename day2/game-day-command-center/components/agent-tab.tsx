"use client"

import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Send, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchJson } from "@/components/fetch-json"

type AgentReply = { answer: string; tools: string[]; sql: string[] }
type Turn = { role: "user" | "assistant"; text: string; tools?: string[]; sql?: string[]; error?: boolean }

const SAMPLES = [
  "Which coaches say they are run-first but actually pass a lot? Quote what they said.",
  "Do donations go up after wins compared to losses?",
  "What were the top complaint categories at the Miami game?",
  "Does attendance go up against air raid teams?",
]

export function AgentTab() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState("")
  const bottom = useRef<HTMLDivElement>(null)

  const ask = useMutation({
    mutationFn: (history: Turn[]) =>
      fetchJson<AgentReply>("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.filter((t) => !t.error).map(({ role, text }) => ({ role, text })) }),
      }),
    onSuccess: (r) => setTurns((t) => [...t, { role: "assistant", text: r.answer, tools: r.tools, sql: r.sql }]),
    onError: (e) => setTurns((t) => [...t, { role: "assistant", text: (e as Error).message, error: true }]),
    onSettled: () => setTimeout(() => bottom.current?.scrollIntoView({ behavior: "smooth" }), 50),
  })

  function send(text: string) {
    const q = text.trim()
    if (!q || ask.isPending) return
    const history = [...turns, { role: "user" as const, text: q }]
    setTurns(history)
    setInput("")
    ask.mutate(history)
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-11rem)] min-h-[520px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[var(--brand-accent)]" />Saturday Ops Assistant</CardTitle>
        <CardDescription>
          Cortex Agent <code className="text-xs">SATURDAY_OPS.AGENTS.SATURDAY_OPS_AGENT</code>: Cortex Analyst on the semantic view plus Cortex Search on coach press conferences
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {turns.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-2">
            {SAMPLES.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-left text-sm rounded-md border border-border p-3 hover:bg-accent transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
              t.role === "user" ? "bg-[var(--brand-primary)] text-white" : t.error ? "bg-destructive/10 text-destructive" : "bg-muted"
            }`}>
              {t.text}
              {!!t.tools?.length && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer text-muted-foreground">How I got this</summary>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.tools.map((tool) => <Badge key={tool} variant="outline">{tool}</Badge>)}
                  </div>
                  {t.sql?.map((s, j) => (
                    <pre key={j} className="mt-2 p-2 rounded bg-background border border-border overflow-x-auto whitespace-pre-wrap">{s}</pre>
                  ))}
                </details>
              )}
            </div>
          </div>
        ))}
        {ask.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Agent is planning, querying and searching…
          </div>
        )}
        <div ref={bottom} />
      </CardContent>
      <form className="flex gap-2 p-4 border-t border-border" onSubmit={(e) => { e.preventDefault(); send(input) }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about revenue, attendance, donors, fan experience or play style…"
          className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={ask.isPending || !input.trim()}><Send className="h-4 w-4" /></Button>
      </form>
    </Card>
  )
}
