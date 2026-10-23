/** All dashboard numbers come from the Day 1 semantic view, so they match the agent and AI/BI dashboards. */
export const SEMANTIC_VIEW = "SATURDAY_OPS.ANALYTICS.SATURDAY_OPS_SV"
export const AGENT = "SATURDAY_OPS.AGENTS.SATURDAY_OPS_AGENT"

export function toNum(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
