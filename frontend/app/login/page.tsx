"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, MeResponse } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiFetch<{ ok: boolean }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const me = await apiFetch<MeResponse>("/auth/me");
      if (me.role === "estudiante") router.push("/student");
      else router.push("/teacher");
    } catch (err) {
      setError("Credenciales invalidas");
    }
  }

  return (
    <main>
      <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
        <h2>Iniciar sesion</h2>
        <form onSubmit={onSubmit}>
          <div className="row">
            <input
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">Entrar</button>
          </div>
          {error && <p>{error}</p>}
        </form>
        <p>Demo: profesor1 / Profesor123* | estudiante1 / Estudiante123*</p>
      </div>
    </main>
  );
}

