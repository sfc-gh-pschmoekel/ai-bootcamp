import { querySnowflake } from "@/lib/snowflake"
import { SEMANTIC_VIEW, toNum } from "@/lib/semantic"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await querySnowflake(`
      SELECT * FROM SEMANTIC_VIEW(${SEMANTIC_VIEW}
        DIMENSIONS home_games.home_week, home_games.home_opponent, home_games.opponent_style, home_games.home_result
        METRICS home_games.total_revenue, home_games.per_cap_spend, home_games.attendance_pct, home_games.donations_after_game)
      ORDER BY home_week`)
    return Response.json(
      rows.map((r) => ({
        week: toNum(r.HOME_WEEK),
        opponent: String(r.HOME_OPPONENT),
        style: String(r.OPPONENT_STYLE),
        result: String(r.HOME_RESULT),
        revenue: toNum(r.TOTAL_REVENUE),
        perCap: toNum(r.PER_CAP_SPEND),
        fillPct: toNum(r.ATTENDANCE_PCT) * 100,
        donations: toNum(r.DONATIONS_AFTER_GAME),
      })),
    )
  } catch (e) {
    console.error(new Date().toISOString(), "[games] failed", e)
    return Response.json({ error: e instanceof Error ? e.message : "Failed to load games" }, { status: 500 })
  }
}
