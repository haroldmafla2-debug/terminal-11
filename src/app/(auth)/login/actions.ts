"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { safeErrorLog } from "@/lib/logger";
import { parseLoginPayload } from "@/services/auth";

export type LoginFormState = {
  success: boolean;
  message: string;
};

export async function loginAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
  try {
    const payload = parseLoginPayload(formData);
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return {
        success: false,
        message: "No fue posible iniciar sesión. Verifica tus credenciales.",
      };
    }
  } catch (error) {
    safeErrorLog("Login action failed", error);

    return {
      success: false,
      message: "Solicitud inválida. Revisa los datos ingresados.",
    };
  }

  redirect("/dashboard");
}
