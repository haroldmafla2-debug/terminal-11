"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Submission = {
  id: number;
  code: string;
  latest_output: string;
  is_submitted: boolean;
  editing_locked: boolean;
};

export default function ActivityWorkspace() {
  const params = useParams<{ id: string }>();
  const activityId = Number(params.id);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [code, setCode] = useState("print('Hola mundo')");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Sin guardar");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    apiFetch<Submission>(`/student/activities/${activityId}/submission`).then((s) => {
      setSubmission(s);
      setCode(s.code || "print('Hola mundo')");
      setOutput(s.latest_output || "");
      setStatus("Cargado");
    });
  }, [activityId]);

  async function saveNow() {
    await apiFetch<Submission>(`/student/activities/${activityId}/save`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    setStatus(`Guardado ${new Date().toLocaleTimeString()}`);
  }

  async function runCode() {
    setStatus("Ejecutando...");
    const res = await apiFetch<{ stdout: string; stderr: string }>(`/student/activities/${activityId}/run`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    setOutput([res.stdout, res.stderr].filter(Boolean).join("\n"));
    setStatus("Ejecucion completada");
  }

  async function submit() {
    const res = await apiFetch<Submission>(`/student/activities/${activityId}/submit`, { method: "POST" });
    setSubmission(res);
    setStatus("Actividad enviada");
  }

  useEffect(() => {
    if (!submission || submission.editing_locked) return;
    intervalRef.current = setInterval(() => {
      saveNow().catch(() => setStatus("Error de guardado"));
    }, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [submission, code]);

  const locked = useMemo(() => submission?.editing_locked ?? false, [submission]);

  return (
    <main>
      <h1>Editor Python</h1>
      <div className="card">
        <p>Estado: {status}</p>
        <div className="actions">
          <button className="secondary" onClick={saveNow} disabled={locked}>Guardar</button>
          <button onClick={runCode} disabled={locked}>Ejecutar</button>
          <button onClick={submit} disabled={locked || submission?.is_submitted}>Enviar actividad</button>
        </div>
      </div>
      <div className="card">
        <MonacoEditor
          height="420px"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ minimap: { enabled: false }, readOnly: locked }}
        />
      </div>
      <div className="card">
        <h3>Consola</h3>
        <pre>{output || "Sin salida"}</pre>
      </div>
    </main>
  );
}
