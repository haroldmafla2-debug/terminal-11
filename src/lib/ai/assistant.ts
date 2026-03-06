import { z } from "zod";

import { ROLE_LABEL, type PortalRole } from "@/lib/constants/roles";

const requestSchema = z.object({
  role: z.enum(["admin", "coordination", "teacher", "student", "guardian"]),
  objective: z.string().trim().min(6).max(600),
  context: z.string().trim().max(1000).optional(),
});

export type AssistantRequest = z.infer<typeof requestSchema>;

const ROLE_PLAYBOOK: Record<PortalRole, string[]> = {
  admin: [
    "Define tres indicadores de gestion academica para el mes.",
    "Proponer una accion por indicador con responsable y fecha.",
    "Incluir un mensaje corto para comunicar a docentes.",
  ],
  coordination: [
    "Identificar riesgo de convivencia o desercion.",
    "Plantear seguimiento con orientacion y familia.",
    "Cerrar con checklist semanal de seguimiento.",
  ],
  teacher: [
    "Estructurar actividad con objetivo, criterio y rubrica.",
    "Incluir adaptacion para estudiantes con ritmo distinto.",
    "Proponer mensaje breve para acudientes.",
  ],
  student: [
    "Crear plan de estudio de 5 pasos con tiempos.",
    "Incluir tecnica de memorizacion y autoevaluacion.",
    "Cerrar con meta medible para hoy.",
  ],
  guardian: [
    "Dar pauta de acompanamiento en casa sin sobrecargar.",
    "Sugerir rutina de 20-30 minutos diaria.",
    "Incluir mensaje motivador concreto para el estudiante.",
  ],
};

function fallbackResponse(input: AssistantRequest) {
  const bullets = ROLE_PLAYBOOK[input.role].map((item) => `- ${item}`).join("\n");
  const contextLine = input.context ? `Contexto adicional: ${input.context}\n\n` : "";

  return `Asistente IA Escolar (${ROLE_LABEL[input.role]})\n\nObjetivo detectado: ${input.objective}\n\n${contextLine}Plan sugerido:\n${bullets}\n\nSiguiente paso recomendado: ejecuta el primer punto hoy y registra evidencia en el portal.`;
}

function extractOutputText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const maybe = payload as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  if (typeof maybe.output_text === "string" && maybe.output_text.trim()) {
    return maybe.output_text.trim();
  }

  const firstText = maybe.output
    ?.flatMap((item) => item.content ?? [])
    .find((entry) => entry?.type === "output_text" && typeof entry.text === "string")?.text;

  return typeof firstText === "string" && firstText.trim() ? firstText.trim() : null;
}

export async function generateAssistantResponse(rawInput: unknown) {
  const input = requestSchema.parse(rawInput);

  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    // Decision: always provide useful output even when AI provider key is missing.
    return fallbackResponse(input);
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const prompt = [
    `Eres un asistente escolar para rol ${ROLE_LABEL[input.role]}.`,
    "Responde en espanol claro, con pasos concretos y accionables.",
    "No inventes reglamentos internos. Usa lenguaje profesional y cercano.",
    `Objetivo: ${input.objective}`,
    input.context ? `Contexto: ${input.context}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_output_tokens: 500,
        input: prompt,
      }),
    });

    if (!response.ok) {
      return fallbackResponse(input);
    }

    const payload = (await response.json()) as unknown;
    const output = extractOutputText(payload);

    return output ?? fallbackResponse(input);
  } catch {
    return fallbackResponse(input);
  }
}
