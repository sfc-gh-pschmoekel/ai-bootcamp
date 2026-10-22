# Day 1 Presenter Script (28 minutes)

Session: 45 minutes total. About 7 minutes of your slides, a 28-minute live demo, then wrap-up and Q&A.

## Before the session (15 minutes ahead)
1. Upload `Saturday_Ops_Day1.ipynb` to your Workspace and click **Run all** once. Everything then exists before you go live:
   - data generation: about 20 seconds
   - AI Functions: about 90 seconds
   - search service: about 90 seconds
2. Make sure the `per_cap_spend` line in the semantic view cell is **commented out** and re-run that cell. This lets you add the metric live.
3. Open a second tab on **AI & ML > Cortex Analyst** with `SATURDAY_OPS.ANALYTICS.SATURDAY_OPS_SV` selected.
4. Collapse the long data generation cell so the audience sees only its title.

Everything below is a re-run of cells that already succeeded. If a live call is slow, keep talking: the results from your pre-run are still in the tables.

## Run of show

| Time | Segment | Cells | What to run live |
|---|---|---|---|
| 0:00 to 3:00 | The data | Intro, 0, 1 | Show the table list and `sample_text` |
| 3:00 to 12:00 | AI Functions | 2a to 2e | Re-run `ticket_insights`, then show `style_check` and the chart |
| 12:00 to 20:00 | Semantic View | 3 | Uncomment `per_cap_spend`, re-run, then use Cortex Analyst |
| 20:00 to 26:00 | Cortex Search | 4 | Run both search cells |
| 26:00 to 28:00 | Payoff | 5 | Run `payoff`, then bridge to Day 2 |

---

### 0:00 to 3:00 | The data
**Say:** "An athletic department is a mid-size retail and events business. Tickets, concessions, merch, donors, fan service. Every one of you has the same shape of data: transactions, customers, and a pile of text nobody can query."

- Point at the data generation cell. "One SQL cell built all of this. Structured tables and unstructured text."
- Run `row_counts`: about 480K tickets and 1M concession transactions.
- Run `sample_text`. Read one press conference line aloud. "This is the data that never makes it into a dashboard."

**Business moment:** ask the BU leads in the audience where their equivalent of a press conference lives: call notes, support tickets, contracts.

### 3:00 to 12:00 | Cortex AI Functions
**Say:** "AI Functions are just SQL. No pipelines, no Python services, no model hosting."

1. Show the `fan_insights` cell (do not re-run; 4,000 rows). Point out `AI_SENTIMENT` with five aspects: food, parking, seats, team, price.
2. **Re-run `ticket_insights` live.** It finishes in about 30 seconds. Explain:
   - `AI_CLASSIFY` with label descriptions routes each ticket to a category.
   - `AI_EXTRACT` pulls out the section, gate and issue.
3. Run a quick ad hoc query, or just narrate the storylines:
   - The heat game (Week 1) is dominated by CONCESSIONS: fans ran out of water.
   - The rain game (Week 4) is dominated by SEATING.
   - The Miami upset (Week 7) has a TICKETING_APP spike: the app went down at the gate.
4. Show `game_text_insights`. The same functions run on recaps and press conferences: a play style label, plus the coach's stated plan.
5. Run `style_check` and show the chart.

**The reveal:** "The AI read 132 recaps and agreed with the stats for all 12 teams. But look at UCLA. The coach claims run-first in every press conference. The stats say 61% passing in the second half. Nobody would catch that reading box scores or transcripts alone. You need both in one place."

### 12:00 to 20:00 | Semantic View
**Say:** "AI is only as trustworthy as the definitions under it. If Ticketing defines attendance as tickets sold and the CFO defines it as scans at the gate, your AI gives two answers. The semantic view defines it once."

1. Scroll the `semantic_view` cell. Call out four things:
   - **Logical tables and relationships:** fans, tickets, home games, teams.
   - **Metrics:** `attendance_pct` (scans divided by capacity), `donations_after_game`, `second_half_pass_rate`.
   - **Synonyms:** "fill rate", "big plays", "tempo".
   - **Custom instruction and verified queries:** "UCLA is the home team", plus 10 verified queries.
2. **Live step:** uncomment `per_cap_spend` and re-run. "I just added a governed metric. Every agent, dashboard and analyst that uses this view gets the same definition."
3. Run `query_semantic_view`. Point out that this is SQL against business concepts, not tables.
4. Switch to the **Cortex Analyst** tab and ask:
   - "Did the Rose Bowl fill better against air-raid teams?" Answer: air-raid opponent about 86.9% vs others about 79%. Caveat: one game.
   - "Which coaches say they're run-first but aren't?" Answer: UCLA.
   - "What was our per cap spend at the USC game?" This uses the metric you just added. Answer: about $98.

**Business moment:** "Ticketing, Development and Football Ops just asked questions in their own words against one definition of the truth."

### 20:00 to 26:00 | Cortex Search
**Say:** "Not every question is a number. Sometimes you need the passage."

1. Show the `create_search` cell. Explain the four filter attributes (team, week, result, media style). Do not re-run it unless you have time; it takes about 90 seconds.
2. Run `search_run_game`. The top results are UCLA losses where the coach says "establishing the run is our identity".
3. Run `search_fourth_down`, which is filtered to BYU. These are press conferences where the coach went for it 4 or 5 times: "That is who we are."

**Bridge:** "Search finds the evidence. The semantic view computes the numbers. Tomorrow an agent will use both in one answer."

### 26:00 to 28:00 | Payoff
Run `payoff`. Walk across one row (USC, Week 11):
- 95.6% fill
- about $98 per cap
- $1.48M given in the following 7 days
- the most positive fan mood of the season

Compare the Miami row:
- the worst sentiment of the season
- 616 complaints, led by the ticketing app
- the lowest post-game giving

**Close:** "Business result, fan voice, and what the coach said versus what the team did: one row, one platform. Tomorrow we hand this to the business: a Cortex Agent on top of this semantic view and search service, delivered in CoWork, with dashboards that use the same definitions."

## Fallbacks
| Problem | What to do |
|---|---|
| An AI cell is slow | Stop the cell. The table from your pre-run is still there; query it. |
| Search service not ready | Show the pre-built service. `SHOW CORTEX SEARCH SERVICES IN SCHEMA SATURDAY_OPS.ANALYTICS` |
| Cortex Analyst gives an unexpected answer | Use it as a teaching moment: open the verified queries in the semantic view and show how they steer answers. |
| Semantic view cell errors after the live edit | Re-comment the `per_cap_spend` line and re-run. Check for a missing comma. |

## Numbers to know (from the generated data)

| Metric | Value |
|---|---|
| UCLA record | 6-5 (home: W Indiana, L Georgia, W Notre Dame, L Miami, W Iowa, W USC) |
| UCLA second-half pass rate | about 61% (season pass rate about 53%) |
| Best fill | USC, Week 11, 95.6% |
| Worst fill | Notre Dame rain game, 68.1% (many no-shows) |
| Biggest giving week | after the USC win, about $1.48M |
| Worst fan sentiment | Miami upset, Week 7 |
| BYU 4th-down attempts | about 3.8 per game (league average about 1.2) |
