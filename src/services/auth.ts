import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido").trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña es demasiado larga"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export function parseLoginPayload(payload: FormData): LoginInput {
  return loginSchema.parse({
    email: payload.get("email"),
    password: payload.get("password"),
  });
}
