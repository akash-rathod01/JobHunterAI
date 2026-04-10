# J-JobHunterAI: Multi-Agent Architecture

The original `job-ops` repository used a simple, monolithic linear pipeline (`Crawl -> Score -> Tailor PDF -> Track`). To make **J-JobHunterAI** distinctly yours and structurally superior, we are refactoring the backend into an **Event-Driven Multi-Agent Swarm**. 

Instead of one script running things in order, we will have independent AI agents communicating through an event queue (via SQLite/Redis). 

## The Four Core Agents

### 1. `ScoutAgent` (The Discovery Node)
*   **Role**: Autonomously manages all extractors (LinkedIn, HereCafe, etc.).
*   **Behavior**: It wakes up on a cron schedule, reads your target parameters, and spins up playwright instances asynchronously. It dumps all extracted raw data into an `unprocessed_jobs` queue and goes back to sleep.
*   **Tech Identity**: Playwright/Cheerio headless extraction.

### 2. `EvaluatorAgent` (The Matchmaker)
*   **Role**: Analyases job fitness natively.
*   **Behavior**: Listens for the `JOB_DISCOVERED` event. Whenever `ScoutAgent` finds a job, this agent wakes up. It fetches your base profile (skills, constraints) and dynamically sends prompts to the LLM to score the job from 0-100. It updates the DB with its verdict.

### 3. `GhostwriterAgent` (The Resume Tailor)
*   **Role**: Creates custom application materials.
*   **Behavior**: Listens for the `JOB_EVALUATED` event. If a job scores above your threshold (e.g., > 80), the GhostwriterAgent dynamically tailors your resume summary, updates your bullet points, and securely generates a customized PDF ready for upload. 

### 4. `CommsAgent` (The Operations Manager)
*   **Role**: Tracks application lifecycles.
*   **Behavior**: Connects to your email or inbox. It watches for replies from recruiters ("We want to interview you...", "Unfortunately..."). It parses the semantic meaning, updates the job board status automatically, and can even draft professional follow-up replies for you.

## How This Destroys the "Wrapper" Stigma
By adopting this **Agent-Driven Architecture**:
1.  The folder structure completely changes. We will gut `orchestrator/pipeline/run.ts` and replace it with an `/agents/` directory containing dedicated agent event loops.
2.  The application becomes modular, asynchronous, and scalable—characteristics of a modern enterprise application, completely foreign to the original codebase.
3.  The term "Orchestrator" dies. Instead, the backend becomes the "J-JobHunterAI Swarm Server".

## Implementation Plan
1. **Restructure Directory:** Create `apps/swarm-server/src/agents/...` and dismantle the old `orchestrator` code.
2. **Setup Event Queue:** Implement a simple message bus using Drizzle/SQLite (e.g., a `agent_events` table).
3. **Port Logic:** Move the existing logic into the respective agent boundary layers.
