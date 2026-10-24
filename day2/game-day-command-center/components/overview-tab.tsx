"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartTooltip, formatTick, getYAxisWidth } from "@/components/chart-utils"
import { fetchJson, usd } from "@/components/fetch-json"

type Kpis = { totalRevenue: number; perCapSpend: number; attendancePct: number; donationsAfterGame: number; totalAttendance: number }
type Game = { week: number; opponent: string; style: string; result: string; revenue: number; perCap: number; fillPct: number; donations: number }

function Kpi({ label, value, hint }: { label: string; value?: string; hint: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value ?? <Skeleton className="h-8 w-28" />}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
    </Card>
  )
}

export function OverviewTab() {
  const kpis = useQuery({ queryKey: ["kpis"], queryFn: () => fetchJson<Kpis>("/api/kpis") })
  const games = useQuery({ queryKey: ["games"], queryFn: () => fetchJson<Game[]>("/api/games") })
  const error = kpis.error ?? games.error
  const chart = (games.data ?? []).map((g) => ({ label: `Wk ${g.week} ${g.opponent}`, revenue: g.revenue }))

  return (
    <div className="space-y-6">
      {error && <Alert variant="destructive"><AlertDescription>{(error as Error).message}</AlertDescription></Alert>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total game-day revenue" value={kpis.data && usd(kpis.data.totalRevenue)} hint="Tickets + concessions + merch, 6 home games" />
        <Kpi label="Per cap spend" value={kpis.data && usd(kpis.data.perCapSpend, 2)} hint="Concessions + merch per attendee" />
        <Kpi label="Rose Bowl fill rate" value={kpis.data && `${(kpis.data.attendancePct * 100).toFixed(1)}%`} hint={kpis.data ? `${kpis.data.totalAttendance.toLocaleString()} scanned fans` : "Scanned attendance / capacity"} />
        <Kpi label="Donations after games" value={kpis.data && usd(kpis.data.donationsAfterGame)} hint="Giving in the 7 days after each game" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by home game</CardTitle>
          <CardDescription>From SATURDAY_OPS_SV, the same metric definitions the agent and dashboards use</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {games.isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis width={getYAxisWidth(chart, "revenue")} tickFormatter={formatTick} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Home game scorecard</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead><TableHead>Opponent</TableHead><TableHead>Style</TableHead><TableHead>Result</TableHead>
                <TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Per cap</TableHead>
                <TableHead className="text-right">Fill</TableHead><TableHead className="text-right">Giving next 7d</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(games.data ?? []).map((g) => (
                <TableRow key={g.week}>
                  <TableCell>{g.week}</TableCell>
                  <TableCell className="font-medium">{g.opponent}</TableCell>
                  <TableCell><Badge variant="outline">{g.style.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell><Badge variant={g.result === "W" ? "default" : "secondary"}>{g.result}</Badge></TableCell>
                  <TableCell className="text-right">{usd(g.revenue)}</TableCell>
                  <TableCell className="text-right">{usd(g.perCap, 2)}</TableCell>
                  <TableCell className="text-right">{g.fillPct.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{usd(g.donations)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
