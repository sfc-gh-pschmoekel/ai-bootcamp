import { querySnowflake } from "@/lib/snowflake"
import { SEMANTIC_VIEW, toNum } from "@/lib/semantic"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await querySnowflake(`
      SELECT * FROM SEMANTIC_VIEW(${SEMANTIC_VIEW}
        METRICS home_games.total_revenue, home_games.per_cap_spend, home_games.attendance_pct,
                home_games.donations_after_game, home_games.total_attendance)`)
    const r = rows[0] ?? {}
    return Response.json({
      totalRevenue: toNum(r.TOTAL_REVENUE),
      perCapSpend: toNum(r.PER_CAP_SPEND),
      attendancePct: toNum(r.ATTENDANCE_PCT),
      donationsAfterGame: toNum(r.DONATIONS_AFTER_GAME),
      totalAttendance: toNum(r.TOTAL_ATTENDANCE),
    })
  } catch (e) {
    console.error(new Date().toISOString(), "[kpis] failed", e)
    return Response.json({ error: e instanceof Error ? e.message : "Failed to load KPIs" }, { status: 500 })
  }
}
