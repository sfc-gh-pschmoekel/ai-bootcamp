"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartTooltip } from "@/components/chart-utils"
import { fetchJson } from "@/components/fetch-json"

type FanData = {
  weeks: { label: string; sentiment: number; complaints: number }[]
  categories: { category: string; complaints: number }[]
}

export function FanTab() {
  const q = useQuery({ queryKey: ["fan"], queryFn: () => fetchJson<FanData>("/api/fan") })
  return (
    <div className="space-y-6">
      {q.error && <Alert variant="destructive"><AlertDescription>{(q.error as Error).message}</AlertDescription></Alert>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fan sentiment by home game</CardTitle>
            <CardDescription>AI_SENTIMENT over fan surveys (-1 to 1)</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {q.isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={q.data?.weeks}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[-0.5, 0.75]} tick={{ fontSize: 12 }} width={40} />
                  <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="sentiment" name="Avg sentiment" stroke="var(--brand-primary)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Service tickets by category</CardTitle>
            <CardDescription>AI_CLASSIFY over fan service tickets</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {q.isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={q.data?.categories} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="complaints" name="Tickets" fill="var(--brand-accent)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
