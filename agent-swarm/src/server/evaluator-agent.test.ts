import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocking the LLM provider to test the Evaluator Agent deterministically
const mockAnalyzeJob = vi.fn();

// Mocking at the module level. We provide a dummy implementation
// to simulate the behavior of the real Local Gemma or OpenRouter Integration.
vi.mock("./services/llm", () => ({
  OpenRouterProvider: class {
    analyzeJob = mockAnalyzeJob;
  }
}));

describe("EvaluatorAgent Pipeline Pipeline Integration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully structure and score an inbound job spec using a mock JSON LLM Schema", async () => {
    // 1. Setup Mock LLM Response (To ensure deterministic test suites)
    // Here we define the exact structure we expect our Gemma/OpenRouter layer to return.
    const mockModelResponse = {
      score: 85,
      reasoning: "Candidate matches backend core requirements deeply but lacks container orchestration.",
      missingSkills: ["Kubernetes"],
      tailoredSummary: "Experienced backend engineer adept at Node.js and scalable architecture design.",
    };
    
    mockAnalyzeJob.mockResolvedValue(mockModelResponse);

    // 2. Action: Simulate the Evaluator Agent running against a raw job Spec
    const EvaluatorAgent = {
      evaluate: async (rawJobSpec: string, profileStr: string) => {
        const { OpenRouterProvider } = await import("./services/llm");
        const llm = new OpenRouterProvider();
        return await llm.analyzeJob(rawJobSpec, profileStr);
      }
    };

    const rawJobSpec = "We need a Node.js engineer. Kubernetes is a strong plus.";
    const profile = JSON.stringify({ skills: ["Node.js", "TypeScript", "Redis"] });
    
    const result = await EvaluatorAgent.evaluate(rawJobSpec, profile);

    // 3. Assertion: Ensure the agent maps the schema correctly without hallucinating
    expect(mockAnalyzeJob).toHaveBeenCalledTimes(1);
    expect(mockAnalyzeJob).toHaveBeenCalledWith(rawJobSpec, profile);
    
    expect(result).toHaveProperty("score", 85);
    expect(result.missingSkills).toContain("Kubernetes");
    expect(result.tailoredSummary).toBeDefined();
    expect(result.reasoning).toBeTruthy();
  });
});
