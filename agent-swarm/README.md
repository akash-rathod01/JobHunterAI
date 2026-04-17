# 🚀 J-JobHunterAI Swarm Control Plane

The localized frontend dashboard and Express backend for monitoring and orchestrating the **J-JobHunterAI Multi-Agent Swarm**. This component allows you to view discovered jobs, manually trigger the Local Evaluator Agent, generate tailored PDFs using the Ghostwriter flow, and track application states locally.

## 🏗 Sub-Architecture

```text
agent-swarm/
├── src/
│   ├── server/           # Node.js Swarm Event Backend
│   │   ├── api/          # Webhook / REST ingress
│   │   ├── db/           # Local SQLite Event Queue
│   │   ├── pipeline/     # Agent Execution Loops
│   │   ├── repositories/ # State access layer
│   │   └── services/     # Integrations (LLM, Scrapers, PDF)
│   ├── client/           # React Glassmorphic Control Plane
│   │   ├── api/          # Typed SDK wrapping the backend
│   │   ├── components/   # Radix primitives
│   │   └── styles/       # Tailwind V4 core
│   └── shared/           # End-to-end type validations
└── data/                 # Segregated SQLite persistence layer
```

## 🛠 Setup & Initialization

1. **Install workspace dependencies (from project root):**
   ```bash
   cd ..
   npm install
   ```

2. **Database Migration:**
   Initializes the `events` and `jobs` schema over the local SQLite instance:
   ```bash
   npm --workspace agent-swarm run db:migrate
   ```

3. **Start the Control Plane:**
   Using the unified script run from root:
   ```bash
   npm run dev:all
   ```

4. **Dashboard Access:**
   - **Enterprise Control Plane (UI):** `http://localhost:5173`
   - **Orchestration API:** `http://localhost:3001`

## 🧠 Local Agent Configuration

Inside the dashboard's `Settings` modal, you can configure your LLM extraction routing.
* **Extreme Privacy (Recommended):** Select `Ollama` and bind it to localhost:11434 (`gemma2:2b`).
* **Hybrid Processing:** Select `OpenRouter` or `openai-compatible` for routing intensive Ghostwriter operations externally.

## 🧪 Testing

The Swarm is backed by automated tests to enforce deterministic queue operations and validate the semantic evaluation schema.

Execute the suite locally:
```bash
npm run test:run
```
