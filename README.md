# 🚀 J-JobHunterAI Enterprise

<div align="center">
  <h3>An enterprise-grade, autonomous Multi-Agent Swarm designed to automate, optimize, and secure the modern job hunting pipeline.</h3>
  <p>J-JobHunterAI goes beyond simple scraping. It is a highly scalable, event-driven multi-agent ecosystem engineered to autonomously discover, process, evaluate, and track job applications with strict data sovereignty.</p>
</div>

---

## 🌟 Enterprise Value Proposition

In the competitive landscape of talent acquisition and placement, efficiency and privacy are paramount. J-JobHunterAI provides:

- **Data Sovereignty:** Completely enclosed infrastructure. All proprietary data, PII, and credentials reside on your local hardware or self-hosted servers. Nothing is transmitted to centralized cloud or external telemetry services without explicit configuration.
- **Autonomous Swarm Intelligence:** Replaces manual application workflows by utilizing an interconnected, self-correcting swarm of advanced local AI agents.
- **High Throughput Processing:** Designed around a resilient, localized event queue, enabling the parallel execution of job extraction, evaluation, and documentation generation.

## 🏗 Swarm Architecture & Diagrams

The core of J-JobHunterAI features specialized autonomous agents operating asynchronously over a localized event-driven pipeline. 

### High-Level Topology

```mermaid
graph TD
    subgraph Ingestion
        A[External Job Boards] -->|Scraping| B(ScoutAgent)
        B -->|Raw Role Spec| C[(SQLite Event Queue)]
    end

    subgraph Evaluation
        C -->|Queue Subscription| D(EvaluatorAgent)
        D -->|Semantic Matching| E{Viable Match?}
        E -->|Yes: Score > 80%| F[(Queue: Ghostwriter)]
        E -->|No| G[Archived Job]
    end

    subgraph Generation
        F -->|Prompt Injection| H(GhostwriterAgent)
        H -->|Critic-Actor Swarm| I[Local Gemma-2]
        I -->|Refined Content| H
        H -->|Compile Check| J[Tailored PDF Resume]
    end

    subgraph Operations
        K[Recruiter Sandbox] -->|Inbound Email| L(CommsAgent)
        L -->|Intent classification| M[Dashboard Sync]
        J -.-> M
    end

    style B fill:#5ab4ac,stroke:#333,stroke-width:2px
    style D fill:#d8b365,stroke:#333,stroke-width:2px
    style H fill:#d8b365,stroke:#333,stroke-width:2px
    style L fill:#5ab4ac,stroke:#333,stroke-width:2px
    style C fill:#ece7f2,stroke:#333,stroke-width:2px
    style I fill:#f0f0f0,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
```

### Agent Behaviors
- 🕵️ **ScoutAgent (Extraction Node):** Autonomously monitors target markets (e.g., tech and remote job platforms), extracts highly-structured role specifications, and securely funnels raw ingestion data into the persistent swarm queue.
- 🧠 **EvaluatorAgent (Semantic Matchmaker):** Intercepts raw job ingestion and executes deep-semantic, multidimensional scoring against localized engineering profiles, determining precise role-to-candidate viability.
- 📝 **GhostwriterAgent (Local Gemma Orchestrator):** A sophisticated multi-level Critic-Actor swarm utilizing local `gemma-2`. Employs narrow-chaining where a "Miner" extracts constraints, a "Writer" iteratively redesigns resume data, and a stringent "Supervisor" validates outputs—guaranteeing zero AI hallucinations before generating pixel-perfect PDF assets.
- 📨 **CommsAgent (Workflow Operations):** Natively monitors inbound communication vectors, automatically parsing recruiter intents (interview invitations, rejections) and syncing updates to the master enterprise dashboard in real-time.

### Event Processing Sequence

```mermaid
sequenceDiagram
    participant Scout as ScoutAgent
    participant Queue as SQLite Queue
    participant Eval as EvaluatorAgent
    participant Ghost as GhostwriterAgent
    participant LLM as Local Gemma-2

    Scout->>Queue: Publish (EVENT: JOB_DISCOVERED, payload: raw_spec)
    Queue-->>Eval: Trigger Webhook (Consume)
    Eval->>LLM: Compare Job Spec vs Base CV
    LLM-->>Eval: JSON { score: 92, missing_skills: ["AWS"] }
    alt Score > Threshold
        Eval->>Queue: Publish (EVENT: JOB_VALIDATED, payload: evaluated_spec)
        Queue-->>Ghost: Trigger Component (Consume)
        Ghost->>LLM: Extract Keywords
        Ghost->>LLM: Rewrite Bullet Points
        Ghost->>LLM: Validate Output against hallucination
        LLM-->>Ghost: Finalized markdown
        Ghost->>Queue: Publish (EVENT: RESUME_GENERATED, path: /out/resume.pdf)
    end
```

## ⚙️ Example Configs & Sample Workflow

A primary benefit of the J-JobHunterAI enterprise architecture is that everything operates on fully-typed JSON constraints. 

### 1. Base Profile Ingestion (Your Resume Data)
You provide a JSON detailing your core experience. This is what the `GhostwriterAgent` draws from.
```json
{
  "profile_id": "eng_lead_01",
  "base_title": "Senior Solutions Engineer",
  "experience": [
    {
      "company": "Enterprise Tech Corp",
      "bullets": [
        "Led a team of 5 engineers to migrate legacy REST to GraphQL.",
        "Reduced query latency by 45% using Redis caching."
      ]
    }
  ]
}
```

### 2. Job Discovered via ScoutAgent
The `ScoutAgent` finds a role calling for heavy Python and performance optimization. It drops this into the Queue:
```json
{
  "job_id": "stripe_099",
  "company": "Stripe",
  "role": "Backend Performance Engineer",
  "requirements": ["Python", "Caching methodologies", "Leadership"]
}
```

### 3. Generated Tailored PDF Output
The `GhostwriterAgent` intercepts the payload, runs a sequence of "Mining" and "Writing" loops, and outputs a freshly tailored bullet point optimized strictly for Stripe:
> **Output:** "Led cross-functional team of 5 engineers to modernize infrastructure, integrating distributed caching methodologies (Redis) that slashed data-retrieval latency by 45%, fulfilling stringent performance SLAs."


## 🛠 Enterprise Tech Stack

Built for maximum performance, determinism, and maintainability:

- **Core Engine:** Node.js, TypeScript, unified monorepo workspace structure.
- **Data Persistence:** Prisma ORM, highly optimized Custom SQLite implementations for state management and local event sourcing.
- **Control Plane:** React, Vite-powered glassmorphic interface built on Radix primitives.
- **AI Infrastructure:** Natively integrated with **Ollama** allowing fully local deployment of `gemma2:2b` for maximum privacy and low latency, backed by OpenRouter/OpenAI compatibility layers for scalable hybrid configurations.

## 🚀 Deployment Guide

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/akash-rathod01/JobHunterAI.git
   cd J-JobHunterAI
   ```
2. **Install Workspace Dependencies:**
   ```bash
   npm install
   ```
3. **Provision the Local AI Engine (Recommended for Absolute Privacy):**
   ```bash
   ollama run gemma2:2b
   ```
4. **Initialize the Control Plane (Dashboard):**
   ```bash
   npm run dev:all
   ```

> 🌐 The enterprise control plane will initialize and become available on `http://localhost:5173`, providing real-time telemetry into agent swarms and generated collateral.

*Note: Production-grade CI via GitHub actions and `dev` scripts are configured.*

## 🧪 Testing & Validation

Enterprise pipelines require rigorous testing paradigms. J-JobHunterAI enforces deterministic operation via:
- **Unit Testing:** Validates Queue states, rate limiters, and telemetry parsers.
- **Integration Testing:** Tests End-to-End ingestion flows mocking LLM outputs using structured JSON schemas.
- **Continuous Integration:** Fully automated `biome` linting and TypeScript checks via GitHub Actions.

## 🔒 Security, Privacy & Self-Hosting

J-JobHunterAI adheres to strict operability and privacy defaults. Your data (emails, resumes, profiles, API keys, credentials) is completely segregated and inherently yours. The system uses local SQLite persistence, guaranteeing the absence of vendor lock-in, external SaaS database dependencies, and unauthorized telemetry tracking.

## ⚠️ Failure Handling

J-JobHunterAI uses a strict, deterministic failure model. Every `/api/*` route returns a uniform JSON envelope so that clients and integrations can handle errors predictably.

### API Response Contract

**Success**
```json
{
  "ok": true,
  "data": { ... },
  "meta": { "requestId": "550e8400-e29b-41d4-a716-446655440000" }
}
```

**Failure**
```json
{
  "ok": false,
  "error": {
    "code": "UPSTREAM_ERROR",
    "message": "Ollama did not respond within the timeout window.",
    "details": { ... }
  },
  "meta": { "requestId": "550e8400-e29b-41d4-a716-446655440000" }
}
```

> Every response – success or failure – includes a `meta.requestId`. Use this ID when filing issues or searching logs.

---

### Error Code Reference

| HTTP Status | `error.code` | Meaning & Common Cause |
|---|---|---|
| `400` | `INVALID_REQUEST` | Malformed request body or missing required fields (Zod validation failure). |
| `401` | `UNAUTHORIZED` | No valid session or missing `Authorization` header. |
| `403` | `FORBIDDEN` | Authenticated but not permitted (e.g. accessing another user's resource). |
| `404` | `NOT_FOUND` | The requested job, run, or route does not exist. |
| `408` | `REQUEST_TIMEOUT` | An async operation (e.g. LLM call) exceeded its timeout. Maps to `AbortError`. |
| `409` | `CONFLICT` | Pipeline is already running; duplicate run request rejected. |
| `422` | `UNPROCESSABLE_ENTITY` | Semantically invalid input (e.g. contradictory config fields). |
| `500` | `INTERNAL_ERROR` | Unexpected server-side failure. Check server logs with the `requestId`. |
| `502` | `UPSTREAM_ERROR` | Downstream service (Ollama, OpenRouter, extractor) returned an error. |
| `503` | `SERVICE_UNAVAILABLE` | A required internal service (e.g. DB, AI engine) is temporarily unavailable. |

---

### Pipeline Failure States

The pipeline run lifecycle has four terminal states recorded in the database:

| State | Triggered by | What to do |
|---|---|---|
| `completed` | All steps finished successfully. | Nothing — check the dashboard for generated PDFs. |
| `failed` | An unhandled exception in any pipeline step. | Inspect server logs filtered by `pipelineRunId`. Fix the root cause and re-trigger via the dashboard. |
| `cancelled` | A cancel request was accepted while the pipeline was running. | Normal — resume a new run when ready. |

**Checking a failed run programmatically:**
```bash
# Trigger pipeline and capture the run ID from the response
curl -X POST http://localhost:3000/api/pipeline/run \
  -H "Content-Type: application/json" | jq '.data.pipelineRunId'

# Query the run status
curl http://localhost:3000/api/pipeline/runs/<pipelineRunId>
```

**Cancelling a running pipeline:**
```bash
curl -X POST http://localhost:3000/api/pipeline/cancel
# Response: { "ok": true, "data": { "accepted": true, "pipelineRunId": "...", "alreadyRequested": false } }
```

> A cancel request sets an internal flag that is checked between each pipeline step (`loadProfile → discoverJobs → importJobs → scoreJobs → processJobs`). The run will stop cleanly at the next checkpoint — it will **not** interrupt mid-step.

---

### Correlation IDs & Log Tracing

All log entries are structured JSON and carry context fields for filtering:

| Field | Scope | Description |
|---|---|---|
| `requestId` | Every HTTP request | Maps to the `x-request-id` header. Pass this header inbound to pin your own ID. |
| `pipelineRunId` | Pipeline runs | Set for the lifetime of a full pipeline execution and all its child log entries. |
| `jobId` | Per-job processing | Set during `summarizeJob` and `generateFinalPdf` steps. |

**Example: tail logs for a specific pipeline run**
```bash
# If using pino-pretty locally
npm run dev:all 2>&1 | grep '"pipelineRunId":"<your-run-id>"'
```

---

### Common Failure Scenarios & Fixes

#### 1. `UPSTREAM_ERROR` — Ollama not reachable
```
error.message: "connect ECONNREFUSED 127.0.0.1:11434"
```
**Fix:** Ensure Ollama is running with the correct model pulled:
```bash
ollama serve          # starts the Ollama daemon
ollama run gemma2:2b  # pulls and warms up the model
```

#### 2. `CONFLICT` — Pipeline already running
```
error.code: "CONFLICT"
error.message: "Pipeline is already running"
```
**Fix:** Wait for the current run to finish, or cancel it:
```bash
curl -X POST http://localhost:3000/api/pipeline/cancel
```

#### 3. `REQUEST_TIMEOUT` — LLM call timed out
```
error.code: "REQUEST_TIMEOUT"
error.message: "Request timed out"
```
**Fix:** The LLM did not return within the configured timeout. Try:
- Switching to a smaller model (`gemma2:2b` instead of a larger variant).
- Reducing `topN` in the pipeline config to process fewer jobs per run.
- Increasing available RAM/VRAM if running locally.

#### 4. `INVALID_REQUEST` — Profile or config validation failed
```
error.code: "INVALID_REQUEST"
error.details: { "fieldErrors": { "experience": ["Required"] } }
```
**Fix:** Validate your `profile.json` against the expected schema. The `details.fieldErrors` map shows exactly which fields are missing or malformed.

#### 5. `INTERNAL_ERROR` — Unexpected crash
```
error.code: "INTERNAL_ERROR"
meta.requestId: "550e8400-..."
```
**Fix:** Search server logs for the `requestId` to find the full stack trace. Open a GitHub issue and include the `requestId`, `pipelineRunId` (if applicable), and the log snippet.

---

## 📝 Licensing & Contribution

This platform is proudly open-source and distributed under the **AGPLv3 License**. Enterprise teams are free to modify, extend agent logic, and formulate custom event loops.

---

<div align="center">
  <b>Architected & Maintained by <a href="https://github.com/akash-rathod01">Akash Rathod</a></b>
</div>
