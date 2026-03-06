"use server";

import { z } from "zod";

import { safeErrorLog } from "@/lib/logger";
import { generateAssistantResponse } from "@/lib/ai/assistant";
import { PORTAL_ROLES } from "@/lib/constants/roles";

const askSchema = z.object({
  role: z.enum(PORTAL_ROLES),
  objective: z.string().trim().min(6).max(600),
  context: z.string().trim().max(1000).optional(),
});

export type AssistantState = {
  ok: boolean;
  answer: string;
  error: string;
};

export const initialAssistantState: AssistantState = {
  ok: false,
  answer: "",
  error: "",
};

export async function askAssistantAction(
  _prev: AssistantState,
  formData: FormData,
): Promise<AssistantState> {
  try {
    const parsed = askSchema.parse({
      role: formData.get("role"),
      objective: formData.get("objective"),
      context: formData.get("context"),
    });

    const answer = await generateAssistantResponse(parsed);

    return {
      ok: true,
      answer,
      error: "",
    };
  } catch (error) {
    safeErrorLog("askAssistantAction failed", error);

    return {
      ok: false,
      answer: "",
      error: "No fue posible generar respuesta IA. Revisa el texto e intenta de nuevo.",
    };
  }
}
