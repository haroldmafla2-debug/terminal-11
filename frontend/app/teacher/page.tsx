"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Course = { id: number; name: string; grade: string };
type Activity = { id: number; title: string };

type SubmissionReview = {
  submission: {
    id: number;
    code: string;
    latest_output: string;
    submitted_at: string | null;
    is_submitted: boolean;
    run_count: number;
  };
  student: { username: string; full_name: string; last_login_at: string | null };
  activity: { id: number; title: string; course_id: number };
};

export default function TeacherPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionReview[]>([]);
  const [courseName, setCourseName] = useState("701-A");
  const [grade, setGrade] = useState("701");
  const [activityTitle, setActivityTitle] = useState("Variables y tipos");
  const [activityDescription, setActivityDescription] = useState("Crear un programa que imprima nombre y edad.");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [filterCourseId, setFilterCourseId] = useState<number | "">("");
  const [filterActivityId, setFilterActivityId] = useState<number | "">("");
  const [filterStudentId, setFilterStudentId] = useState<number | "">("");

  async function loadAll() {
    const loadedCourses = await apiFetch<Course[]>("/teacher/courses");
    setCourses(loadedCourses);
    if (loadedCourses.length && !selectedCourse) {
      setSelectedCourse(loadedCourses[0].id);
    }

    const loadedActivities = await apiFetch<Activity[]>("/teacher/activities");
    setActivities(loadedActivities);

    const params = new URLSearchParams();
    if (filterCourseId) params.set("course_id", String(filterCourseId));
    if (filterActivityId) params.set("activity_id", String(filterActivityId));
    if (filterStudentId) params.set("student_id", String(filterStudentId));
    const query = params.toString() ? `?${params.toString()}` : "";
    const loadedSubmissions = await apiFetch<SubmissionReview[]>(`/teacher/submissions${query}`);
    setSubmissions(loadedSubmissions);
  }

  useEffect(() => {
    loadAll().catch(console.error);
  }, []);

  async function createCourse(e: FormEvent) {
    e.preventDefault();
    await apiFetch("/teacher/courses", {
      method: "POST",
      body: JSON.stringify({ name: courseName, grade }),
    });
    await loadAll();
  }

  async function createActivity(e: FormEvent) {
    e.preventDefault();
    if (!selectedCourse) return;
    await apiFetch("/teacher/activities", {
      method: "POST",
      body: JSON.stringify({
        course_id: selectedCourse,
        title: activityTitle,
        description: activityDescription,
        lock_after_submit: true,
        exam_mode: false,
      }),
    });
    await loadAll();
  }

  return (
    <main>
      <h1>Panel del Profesor</h1>

      <div className="card">
        <h2>Crear curso</h2>
        <form className="row" onSubmit={createCourse}>
          <input value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
          <input value={grade} onChange={(e) => setGrade(e.target.value)} required />
          <button type="submit">Crear curso</button>
        </form>
      </div>

      <div className="card">
        <h2>Crear actividad</h2>
        <form onSubmit={createActivity}>
          <div className="row">
            <select
              value={selectedCourse ?? ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)} required />
          </div>
          <textarea
            style={{ marginTop: 12 }}
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            required
          />
          <div style={{ marginTop: 12 }}>
            <button type="submit">Crear actividad</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Entregas</h2>
        <div className="row">
          <select
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Todos los cursos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            placeholder="ID actividad"
            value={filterActivityId}
            onChange={(e) => setFilterActivityId(e.target.value ? Number(e.target.value) : "")}
          />
          <input
            placeholder="ID estudiante"
            value={filterStudentId}
            onChange={(e) => setFilterStudentId(e.target.value ? Number(e.target.value) : "")}
          />
          <button onClick={() => loadAll()}>Aplicar filtros</button>
        </div>
        <p style={{ marginTop: 12 }}>
          <a
            href={`${apiUrl}/teacher/submissions/export${filterCourseId ? `?course_id=${filterCourseId}` : ""}`}
            target="_blank"
            rel="noreferrer"
          >
            Descargar CSV
          </a>
        </p>
        {submissions.map((row) => (
          <div key={row.submission.id} className="card">
            <p>
              <strong>{row.student.full_name}</strong> ({row.student.username}) - {row.activity.title}
            </p>
            <p>
              Ultima conexion: {row.student.last_login_at ? new Date(row.student.last_login_at).toLocaleString() : "N/A"}
            </p>
            <p>
              Estado: {row.submission.is_submitted ? "Enviada" : "Borrador"} | Runs: {row.submission.run_count}
            </p>
            <pre>{row.submission.code}</pre>
            <pre>{row.submission.latest_output || "Sin salida"}</pre>
          </div>
        ))}
      </div>
    </main>
  );
}

