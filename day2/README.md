# Day 2: Deliver AI to the Business

**Topics:** Cortex Agents, Agent Studio, Agents REST API, Snowflake-managed MCP servers, CoWork, AI/BI dashboards, keeping the semantic layer the source of truth

Day 2 builds on the `SATURDAY_OPS` database created in [Day 1](../day1/), so keep it in place.

## Run it
1. Download [`Saturday_Ops_Day2.ipynb`](Saturday_Ops_Day2.ipynb).
2. In Snowsight, go to **Projects > Workspaces > + Add > Upload Files**, and select the notebook.
3. Select a warehouse and click **Run all**. The agent cells take about a minute each.

## What you will learn

| Section | Feature | Business unit |
|---|---|---|
| 1 | Recap of Day 1: data, AI Functions, semantic view, Cortex Search | All |
| 2 | `CREATE AGENT ... FROM SPECIFICATION` with Analyst, Search and Chart tools; `DATA_AGENT_RUN` | All |
| 3 | Agent Studio: tools, instructions, playground trace, monitoring | All |
| 4 | Call the agent over the REST API from your laptop (Python, streaming, curl) | Developers |
| 5 | `CREATE MCP SERVER` exposing the agent, semantic view and search service as MCP tools | Developers |
| 6 | Deliver the agent in Snowflake CoWork | Ticketing, Concessions, Development, Fan Experience, Football Ops |
| 7 | AI/BI dashboard generated from the semantic view | Leadership |
| 8 | (Optional) Snowflake App Runtime app | Ops floor |

## Prerequisites
- Day 1 completed, with the same role
- A role that can create agents and MCP servers (ACCOUNTADMIN or SYSADMIN in a trial account)
- For section 4 and 5: a Programmatic Access Token (PAT) and Python with `requests` on your laptop
- Snowflake CoWork enabled in the account for section 6
- If your region lacks the models: `ALTER ACCOUNT SET CORTEX_ENABLED_CROSS_REGION = 'ANY_REGION';`

## What Day 2 builds
```
SATURDAY_OPS
  AGENTS      SATURDAY_OPS_AGENT  (Cortex Agent: Analyst + Search + Chart)
              SATURDAY_OPS_MCP    (managed MCP server: agent, semantic view, search)
```

## Cleanup
```sql
DROP SCHEMA IF EXISTS SATURDAY_OPS.AGENTS;
```
