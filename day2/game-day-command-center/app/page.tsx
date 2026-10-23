import { CommandCenter } from "@/components/command-center"

// Required: Snowflake is not reachable during docker build.
export const dynamic = "force-dynamic"

export default function Home() {
  return <CommandCenter />
}
