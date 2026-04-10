import { logger } from "@infra/logger";
import type { Job } from "@shared/types";
import { LlmService } from "./llm/service";
import type { JsonSchemaDefinition } from "./llm/types";

// Schema for Level 1: The Miner
const EXTRACT_SKILLS_SCHEMA: JsonSchemaDefinition = {
  name: "required_skills",
  schema: {
    type: "object",
    properties: {
      skills: {
        type: "array",
        items: { type: "string" },
        description: "The top 3 essential hard skills strongly required for the job",
      },
    },
    required: ["skills"],
    additionalProperties: false,
  },
};

// Schema for Level 3: The Supervisor 
const CRITIQUE_SCHEMA: JsonSchemaDefinition = {
  name: "draft_critique",
  schema: {
    type: "object",
    properties: {
      approved: {
        type: "boolean",
        description: "True if the draft is natural, impactful, and lacks hallucinated buzzwords.",
      },
      feedback: {
        type: "string",
        description: "Actionable critique. Leave empty string if approved.",
      },
    },
    required: ["approved", "feedback"],
    additionalProperties: false,
  },
};

/**
 * Advanced Multi-Level Swarm Orchestrator powered natively by Gemma.
 * This class coordinates multiple isolated AI instances (personas) to ensure
 * high quality output through a critic-actor loop.
 */
export class GemmaOrchestrator {
  private llm: LlmService;

  constructor(private modelName: string = "gemma2:2b") {
    // Explicitly targets the local Ollama provider for lightning fast execution.
    // If Ollama is unavailable, the fallback policies inside LLMService handle routing.
    this.llm = new LlmService({ provider: "ollama" });
  }

  /**
   * Level 1: The Miner
   * Discovers the exact structural needs of the role.
   */
  async extractRequiredSkills(job: Job): Promise<string[]> {
    logger.info("Gemma Orchestrator: Miners analyzing job parameters", { jobId: job.id });
    
    const prompt = `You are a strict technical recruiter. Read this job description and extract exactly the top 3 most important technical hard skills required.
Job Title: ${job.title}
Description: ${job.jobDescription || "No description"}`;

    const result = await this.llm.callJson<{ skills: string[] }>({
      model: this.modelName,
      messages: [{ role: "user", content: prompt }],
      jsonSchema: EXTRACT_SKILLS_SCHEMA,
      maxRetries: 2,
      jobId: job.id,
    });

    if (!result.success) {
       logger.warn("Miner failed, bypassing extraction parameter.");
       return [];
    }
    return result.data.skills.slice(0, 3);
  }

  /**
   * Level 2: The Ghostwriter
   * Performs an isolated injection of targeted skills into an existing career bullet.
   */
  async draftRewrite(bullet: string, skills: string[], job: Job, feedback?: string): Promise<string> {
    const prompt = `You are an expert resume Ghostwriter. 
Original Bullet: "${bullet}"
Target Skills that MUST be highlighted: ${skills.join(", ")}
Job Context: ${job.title}

Instructions:
1. Rewrite this bullet to naturally highlight the target skills WITHOUT entirely fabricating experience.
2. Keep it punchy and strictly to one or two sentences.
${feedback ? `\nPREVIOUS QA FEEDBACK TO FIX: ${feedback}` : ""}`;

    const schema: JsonSchemaDefinition = {
      name: "rewritten_bullet",
      schema: {
        type: "object",
        properties: { bullet: { type: "string" } },
        required: ["bullet"],
        additionalProperties: false
      }
    };

    const result = await this.llm.callJson<{ bullet: string }>({
      model: this.modelName,
      messages: [{ role: "user", content: prompt }],
      jsonSchema: schema,
      maxRetries: 2,
    });

    return result.success ? result.data.bullet : bullet;
  }

  /**
   * Level 3: The Supervisor 
   * Validates the Ghostwriter's draft against quality thresholds.
   */
  async critiqueDraft(draft: string, job: Job): Promise<{ approved: boolean; feedback: string }> {
    const prompt = `You are a strict Quality Assurance Supervisor reviewing a resume draft against a job order.
Job Title: ${job.title}
Bullet Draft: "${draft}"

Question: Does this bullet sound naturally written by a human, and does it strictly avoid sounding like spam or hallucinated buzzwords? Be extremely harsh.`;

    const result = await this.llm.callJson<{ approved: boolean; feedback: string }>({
      model: this.modelName,
      messages: [{ role: "user", content: prompt }],
      jsonSchema: CRITIQUE_SCHEMA,
      maxRetries: 2,
    });

    return result.success ? result.data : { approved: true, feedback: "" };
  }

  /**
   * Root Orchestrator Protocol
   * This is the API surface downstream systems call to activate the Gemma Swarm.
   */
  async orchestrateBulletTailoring(originalBullet: string, job: Job): Promise<string> {
    const skills = await this.extractRequiredSkills(job);
    if (!skills.length) return originalBullet;

    let draft = await this.draftRewrite(originalBullet, skills, job);
    
    // The Swarm Loop: Multi-pass Critique (Max 2 revisions)
    for (let pass = 1; pass <= 2; pass++) {
       const critique = await this.critiqueDraft(draft, job);
       
       if (critique.approved) {
         logger.info(`Gemma Orchestrator: Architect approved draft on pass ${pass}.`);
         return draft;
       }
       
       logger.info(`Gemma Orchestrator: Critique failed on pass ${pass}. Enforcing revision.`, { feedback: critique.feedback });
       draft = await this.draftRewrite(originalBullet, skills, job, critique.feedback);
    }
    
    // Safety Fallback: If Gemma Supervisor constantly rejects it after multiple passes, abort and use original.
    logger.warn("Gemma Orchestrator: Supervisor rejected all revisions. Aborting tailoring safety-circuit and yielding original.");
    return originalBullet;
  }
}
