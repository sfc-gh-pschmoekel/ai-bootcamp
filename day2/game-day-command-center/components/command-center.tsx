"use client"

import { useState } from "react"
import { BarChart3, HeartPulse, MessageSquare } from "lucide-react"
import { OverviewTab } from "@/components/overview-tab"
import { FanTab } from "@/components/fan-tab"
import { AgentTab } from "@/components/agent-tab"

const TABS = [
  { id: "overview", label: "Game Day Overview", icon: BarChart3 },
  { id: "fan", label: "Fan Experience", icon: HeartPulse },
  { id: "agent", label: "Ask the Agent", icon: MessageSquare },
] as const

type TabId = (typeof TABS)[number]["id"]

export function CommandCenter() {
  const [tab, setTab] = useState<TabId>("overview")
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <nav className="flex gap-1 border-b border-border mb-6" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id
                ? "border-[var(--brand-accent)] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
      {/* Keep the agent tab mounted so the conversation survives tab switches */}
      <div hidden={tab !== "overview"}><OverviewTab /></div>
      <div hidden={tab !== "fan"}><FanTab /></div>
      <div hidden={tab !== "agent"}><AgentTab /></div>
    </div>
  )
}
