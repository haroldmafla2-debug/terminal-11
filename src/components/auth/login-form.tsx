"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginFormState } from "@/app/(auth)/login/actions";

type LoginFormProps = {
  action: (state: LoginFormState, formData: FormData) => Promise<LoginFormState>;
};

const initialState: LoginFormState = {
  success: false,
  message: "",
};

export function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ingresar al portal</CardTitle>
        <CardDescription>Autenticación segura con Supabase Auth.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo institucional</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
            />
          </div>
          {state.message ? (
            <p className="text-sm text-red-700" role="alert">
              {state.message}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Validando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
