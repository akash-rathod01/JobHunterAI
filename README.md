# 🚀 J-JobHunterAI

<div align="center">
  <h3>An intelligent, self-hosted Agent Swarm designed to completely automate and optimize the job hunting pipeline.</h3>
  <p>J-JobHunterAI isn't a simple scraper—it's a modular, event-driven multi-agent system that discovers, scores, tailors, and tracks job applications autonomously.</p>
</div>

---

## 🌟 The Swarm Architecture

This powerful platform utilizes specialized AI agents operating on a localized event queue to parallelize and manage your job finding sequence:

- 🕵️ **ScoutAgent (Extraction Node):** Autonomously crawls target platforms (gradcracker, workingnomads, etc.), extracts relevant role specifications, and funnels raw data into the swarm queue.
- 🧠 **EvaluatorAgent (LLM Matchmaker):** Intercepts raw jobs and performs deep-semantic scoring against your predefined engineering profile mapping out exactly why you match the role.
- 📝 **GhostwriterAgent (PDF Tailor):** Upon discovering a high-match percentage, automatically dynamically alters your resume summary and constructs a pixel-perfect, tailored PDF for the specific role without human intervention.
- 📨 **CommsAgent (Inbox Ops):** Watches for incoming recruiter communications natively, parsing interview invites or rejection semantics, updating the master dashboard in real-time.

## 🛠 Tech Stack

J-JobHunterAI is built for high performance, ease of use, and deep extensibility:

- **Core Engine:** Node.js, TypeScript, and a unified workspace methodology.
- **Database:** Prisma & Custom SQLite implementations managing event states and telemetry tracking.
- **Frontend Panel:** React, Vite, and a custom Dark Swarm glassmorphic interface leveraging native Radix component boundaries.
- **AI Processing:** OpenRouter / OpenAI compatibility layers for autonomous resume generation and text analysis.

## 🚀 Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/[your-username]/J-JobHunterAI.git
   cd J-JobHunterAI
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Execute the Swarm Dashboard:**
   ```bash
   npm run dev
   ```

> 🌐 A sleek, independent dashboard will launch on `http://localhost:3005` displaying your active agent operations and tailored resumes!

## 🔒 Privacy & Self-Hosting
Your data (emails, resumes, API keys) is fundamentally yours. J-JobHunterAI is built entirely around self-hosted principles via local SQLite persistence. No external analytics, no SaaS database dependencies, no VC-backed telemetry.

## 📝 License
This project is open-sourced under the AGPLv3. Feel free to extend the agents and share your custom logic loops.
