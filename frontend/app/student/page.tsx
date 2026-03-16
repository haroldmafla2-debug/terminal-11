"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Activity = {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  status: string;
};

export default function StudentPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Activity[]>("/student/activities")
      .then(setActivities)
      .catch(() => setError("No fue posible cargar actividades"));
  }, []);

  return (
    <main>
      <h1>Panel del Estudiante</h1>
      <p>
        <Link href="/login">Cerrar sesion</Link>
      </p>
      {error && <p>{error}</p>}
      {activities.map((a) => (
        <div className="card" key={a.id}>
          <h3>{a.title}</h3>
          <p>{a.description}</p>
          <p>Fecha limite: {a.due_date ? new Date(a.due_date).toLocaleString() : "Sin limite"}</p>
          <Link href={`/student/activity/${a.id}`}>Abrir actividad</Link>
        </div>
      ))}
    </main>
  );
}

