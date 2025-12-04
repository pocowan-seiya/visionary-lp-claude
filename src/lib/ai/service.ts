import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeneratedSection } from "@/types";

export type AIProvider = "claude" | "openai" | "gemini";

export interface AIGenerationOptions {
  provider?: AIProvider;
  systemPrompt: string;
  userPrompt: string;
}

export interface AIGenerationResult {
  sections: GeneratedSection[];
  provider: AIProvider;
  rawResponse: string;
}

/**
 * Generate LP sections using Claude (Anthropic)
 */
async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<{ sections: GeneratedSection[]; rawResponse: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const rawResponse = content.text;

  // Extract JSON from markdown code blocks if present
  const jsonMatch = rawResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;

  const parsed = JSON.parse(jsonString);
  return {
    sections: parsed.sections,
    rawResponse,
  };
}

/**
 * Generate LP sections using OpenAI
 */
async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<{ sections: GeneratedSection[]; rawResponse: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const rawResponse = completion.choices[0].message.content || "";
  const parsed = JSON.parse(rawResponse);

  return {
    sections: parsed.sections,
    rawResponse,
  };
}

/**
 * Generate LP sections using Google Gemini
 */
async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<{ sections: GeneratedSection[]; rawResponse: string }> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  });

  const prompt = `${systemPrompt}\n\n${userPrompt}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const rawResponse = response.text();

  const parsed = JSON.parse(rawResponse);
  return {
    sections: parsed.sections,
    rawResponse,
  };
}

/**
 * Get default AI provider based on available API keys
 */
export function getDefaultProvider(): AIProvider {
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GOOGLE_API_KEY) return "gemini";
  throw new Error("No AI provider API key is configured");
}

/**
 * Generate LP sections using specified AI provider
 */
export async function generateLPSections(
  options: AIGenerationOptions
): Promise<AIGenerationResult> {
  const provider = options.provider || getDefaultProvider();

  console.log(`Generating LP sections with provider: ${provider}`);

  let result: { sections: GeneratedSection[]; rawResponse: string };

  try {
    switch (provider) {
      case "claude":
        result = await generateWithClaude(
          options.systemPrompt,
          options.userPrompt
        );
        break;
      case "openai":
        result = await generateWithOpenAI(
          options.systemPrompt,
          options.userPrompt
        );
        break;
      case "gemini":
        result = await generateWithGemini(
          options.systemPrompt,
          options.userPrompt
        );
        break;
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    console.log(
      `Successfully generated ${result.sections.length} sections with ${provider}`
    );

    return {
      sections: result.sections,
      provider,
      rawResponse: result.rawResponse,
    };
  } catch (error) {
    console.error(`Error generating with ${provider}:`, error);
    throw error;
  }
}
