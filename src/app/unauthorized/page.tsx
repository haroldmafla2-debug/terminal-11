import Link from "next/link";

import { FeaturePlaceholder } from "@/components/layout/feature-placeholder";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6 text-center">
        <FeaturePlaceholder
          title="Acceso restringido"
          description="Tu rol no tiene permisos para ingresar a este módulo."
        />
        <Link className="text-sm font-medium text-slate-700 underline" href="/dashboard">
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
}
