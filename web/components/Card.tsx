import React from "react";

export function Card({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md">
      {eyebrow ? <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</div> : null}
      <div className="mt-2 text-lg font-semibold text-slate-900">{title}</div>
      {children ? <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div> : null}
    </div>
  );
}
