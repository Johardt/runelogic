import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { type LanguageModel } from "ai";

export function getLanguageModel({
  modelId,
  vendorId,
  apiKey,
}: {
  modelId: string;
  vendorId: string;
  apiKey: string;
}): LanguageModel {
  switch (vendorId) {
    case "openai":
      return createOpenAI({ apiKey })(modelId);
    case "google":
      return createGoogleGenerativeAI({ apiKey })(modelId, {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_CIVIC_INTEGRITY",
            threshold: "BLOCK_NONE",
          },
        ],
      });
    default:
      throw new Error(`Unsupported vendor: ${vendorId}`);
  }
}
