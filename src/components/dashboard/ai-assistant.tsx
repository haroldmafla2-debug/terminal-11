"use client";

import { useActionState } from "react";

import { askAssistantAction, initialAssistantState } from "@/app/(portal)/dashboard/actions";
import { ROLE_LABEL, type PortalRole } from "@/lib/constants/roles";

type AiAssistantProps = {
  role: PortalRole;
};

export function AiAssistant({ role }: AiAssistantProps) {
  const [state, formAction, pending] = useActionState(askAssistantAction, initialAssistantState);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">IA Escolar</p>
        <h2 className="text-xl font-semibold text-slate-900">Asistente para {ROLE_LABEL[role]}</h2>
        <p className="text-sm text-slate-600">
          Describe una necesidad y recibe un plan practico para ejecutar hoy.
        </p>
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="role" value={role} />

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Objetivo</span>
          <textarea
            name="objective"
            required
            minLength={6}
            maxLength={600}
            placeholder="Ej: Necesito una actividad de matematicas para grado 10 con rubrica y adaptaciones."
            className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Contexto (opcional)</span>
          <textarea
            name="context"
            maxLength={1000}
            placeholder="Ej: curso 10A, 35 estudiantes, 2 con acompanamiento pedagogico."
            className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Generando..." : "Generar plan IA"}
        </button>
      </form>

      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}

      {state.ok ? (
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase">
            Respuesta sugerida
          </p>
          <pre className="text-sm whitespace-pre-wrap text-slate-800">{state.answer}</pre>
        </div>
      ) : null}
    </section>
  );
}
