# Game Day Command Center

A Snowflake App Runtime web app (Next.js) for the Saturday Ops bootcamp, Day 2.

| Tab | What it shows | Source |
|---|---|---|
| Game Day Overview | Revenue, per cap spend, fill rate, post-game giving, revenue by game, home game scorecard | `SATURDAY_OPS.ANALYTICS.SATURDAY_OPS_SV` |
| Fan Experience | AI sentiment by week, AI-classified service tickets by category | `SATURDAY_OPS.ANALYTICS.SATURDAY_OPS_SV` |
| Ask the Agent | Chat with the Saturday Ops Cortex Agent, with tools used and generated SQL | `SATURDAY_OPS.AGENTS.SATURDAY_OPS_AGENT` |

Every number comes from the semantic view, so the app, the agent, CoWork and the AI/BI dashboard agree.

## How the agent tab works
`app/api/agent/route.ts` runs `SNOWFLAKE.CORTEX.DATA_AGENT_RUN('SATURDAY_OPS.AGENTS.SATURDAY_OPS_AGENT', ?)` with the conversation passed as a bind parameter. The app runs inside Snowflake, so there is no PAT and no external access. It's the same agent you call over REST (section 4) and MCP (section 5).

## Files
- `app/api/kpis`, `app/api/games`, `app/api/fan`: `SEMANTIC_VIEW()` queries
- `app/api/agent`: the agent call
- `components/command-center.tsx`: the tabs
- `components/overview-tab.tsx`, `fan-tab.tsx`, `agent-tab.tsx`: one per tab
- `app.yml` (build and run) and `snowflake.yml` (deploy target: `SATURDAY_OPS.AGENTS.GAME_DAY_COMMAND_CENTER`)

## Prerequisites
Day 1 and Day 2 notebooks run (the semantic view, search service and agent must exist).

## Deploy
From a terminal with the [Snowflake CLI](https://docs.snowflake.com/en/developer-guide/snowflake-cli/index) (3.26+) and a connection that uses the role you used for the notebooks:
```bash
cd game-day-command-center
snow app deploy
```
The CLI uploads the source, builds it remotely and creates the `APPLICATION SERVICE`. The app URL is printed at the end. You can also find it with `SHOW APPLICATION SERVICES IN SCHEMA SATURDAY_OPS.AGENTS`.

## Run locally
```bash
npm install
npm run dev
```
This uses your default `snow` CLI connection.

## Share it
Grant the role that should open the app usage on the service. See notebook section 8.

All data is synthetic.
