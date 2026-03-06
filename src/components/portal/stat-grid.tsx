type StatItem = {
  label: string;
  value: string;
  hint?: string;
};

type StatGridProps = {
  items: StatItem[];
};

export function StatGrid({ items }: StatGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs tracking-wide text-slate-500 uppercase">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          {item.hint ? <p className="mt-1 text-xs text-slate-600">{item.hint}</p> : null}
        </article>
      ))}
    </div>
  );
}
