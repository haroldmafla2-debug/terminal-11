import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="card">
        <h1>Profe Harold Mafla</h1>
        <p>Accede con tu usuario institucional.</p>
        <Link href="/login">Ir a login</Link>
      </div>
    </main>
  );
}

