export function SectionHeading({ kicker, title, desc }: { kicker?: string; title: string; desc?: string }) {
  return (
    <div className="max-w-2xl">
      {kicker ? <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{kicker}</div> : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      {desc ? <p className="mt-4 text-base leading-7 text-slate-600">{desc}</p> : null}
    </div>
  );
}
