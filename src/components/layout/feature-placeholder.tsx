import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FeaturePlaceholderProps = {
  title: string;
  description: string;
};

export function FeaturePlaceholder({ title, description }: FeaturePlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          Módulo base listo para PR1. En siguientes PR se conecta a base de datos, RLS y flujos
          transaccionales.
        </p>
      </CardContent>
    </Card>
  );
}
