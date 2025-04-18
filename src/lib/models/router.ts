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
      return createGoogleGenerativeAI({ apiKey })(modelId);
    default:
      throw new Error(`Unsupported vendor: ${vendorId}`);
  }
}
