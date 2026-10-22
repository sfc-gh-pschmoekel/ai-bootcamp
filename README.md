# AI Bootcamp: Deliver a Semantic Layer and Agents to the Business

A two-session, hands-on bootcamp that shows how to build a governed semantic layer in Snowflake and put AI on top of it for the business units that need it most.

The running example is **Saturday Ops**: the game-day business of the UCLA athletic department (tickets, concessions, merch, donors, fan experience) plus a Football Ops view of how every team in a 12-team conference really plays.

| Session | Topics | Status |
|---|---|---|
| [Day 1](day1/) | Semantic Views, Cortex Search, Cortex AI Functions | Available |
| [Day 2](day2/) | Cortex Agents, CoWork, AI/BI dashboards, keeping the semantic layer the source of truth | Coming soon |

## Quickstart (Day 1)

1. Download [`day1/Saturday_Ops_Day1.ipynb`](day1/Saturday_Ops_Day1.ipynb).
2. In Snowsight, go to **Projects > Workspaces**, click **+ Add > Upload Files**, and select the notebook.
3. Open the notebook, select a warehouse, and click **Run all**.

That is the entire setup. One SQL cell generates all of the data. There are no files to load, no stages, no API or Git integrations, and no external access.

### Prerequisites
- A Snowflake account (a free trial works) in a region with Cortex AI Functions and Cortex Search available
- A role that can create a database and a warehouse (ACCOUNTADMIN or SYSADMIN in a trial account)
- About 5 minutes of XS warehouse time plus a small amount of Cortex AI credits

## What Day 1 builds

```
SATURDAY_OPS
  RAW         13 synthetic tables: teams, games, team stats, fans, tickets, concessions,
              merch, donations, game recaps, coach press conferences, fan surveys,
              fan service tickets
  ANALYTICS   FAN_INSIGHTS, TICKET_INSIGHTS, GAME_TEXT_INSIGHTS   (AI Functions)
              TEAM_STYLE_PROFILE   (stats merged with text)
              GAME_BUSINESS_SUMMARY, TEAM_GAME_RESULTS
              SATURDAY_OPS_SV      (semantic view, 10 verified queries)
              COACH_PRESSER_SEARCH (Cortex Search service)
```

A reference copy of the semantic view is in [`day1/reference/saturday_ops_sv.yaml`](day1/reference/saturday_ops_sv.yaml).

## Cleanup
```sql
DROP DATABASE IF EXISTS SATURDAY_OPS;
DROP WAREHOUSE IF EXISTS SATURDAY_OPS_WH;
```
Keep the database between Day 1 and Day 2. Day 2 builds on it.

## Disclaimer
All data is synthetic and generated for training purposes. School names are used for illustration only. Coaches and players are generic aliases (for example "BYU Head Coach", QB1, RB1). Scores, statistics, quotes, play styles and business figures are fictional and do not describe any real program, person or organization. This project is not affiliated with or endorsed by any university, conference or athletic program.

## License
[Apache 2.0](LICENSE)
