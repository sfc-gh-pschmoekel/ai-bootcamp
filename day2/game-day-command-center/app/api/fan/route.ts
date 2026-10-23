import { querySnowflake } from "@/lib/snowflake"
import { SEMANTIC_VIEW, toNum } from "@/lib/semantic"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [weeks, categories] = await Promise.all([
      querySnowflake(`
        SELECT * FROM SEMANTIC_VIEW(${SEMANTIC_VIEW}
          DIMENSIONS home_games.home_week, home_games.home_opponent
          METRICS fan_feedback.avg_fan_sentiment, fan_cases.complaint_count)
        ORDER BY home_week`),
      querySnowflake(`
        SELECT * FROM SEMANTIC_VIEW(${SEMANTIC_VIEW}
          DIMENSIONS fan_cases.complaint_category
          METRICS fan_cases.complaint_count)
        ORDER BY complaint_count DESC`),
    ])
    return Response.json({
      weeks: weeks.map((r) => ({
        label: `Wk ${toNum(r.HOME_WEEK)} ${r.HOME_OPPONENT}`,
        sentiment: toNum(r.AVG_FAN_SENTIMENT),
        complaints: toNum(r.COMPLAINT_COUNT),
      })),
      categories: categories.map((r) => ({
        category: String(r.COMPLAINT_CATEGORY).replace(/_/g, " "),
        complaints: toNum(r.COMPLAINT_COUNT),
      })),
    })
  } catch (e) {
    console.error(new Date().toISOString(), "[fan] failed", e)
    return Response.json({ error: e instanceof Error ? e.message : "Failed to load fan data" }, { status: 500 })
  }
}
