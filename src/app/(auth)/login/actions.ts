"use server";

import { redirect } from "next/navigation";

import { safeErrorLog } from "@/lib/logger";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { parseLoginPayload } from "@/services/auth";

export type LoginFormState = {
  success: boolean;
  message: string;
};

export async function loginAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
  try {
    if (!hasSupabaseEnv()) {
      return {
        success: false,
        message: "Faltan variables de Supabase en el entorno de despliegue.",
      };
    }

    const payload = parseLoginPayload(formData);
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return {
        success: false,
        message: "No fue posible iniciar sesion. Verifica tus credenciales.",
      };
    }
  } catch (error) {
    safeErrorLog("Login action failed", error);

    return {
      success: false,
      message: "Solicitud invalida. Revisa los datos ingresados.",
    };
  }

  redirect("/dashboard");
}