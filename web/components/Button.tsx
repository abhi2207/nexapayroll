import Link from "next/link";
import React from "react";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-soft",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
};

export function Button({ href, children, variant = "primary", className = "", type = "button", onClick, disabled }: Props) {
  const cls = `${base} ${variants[variant]} ${className} ${disabled ? "opacity-60 pointer-events-none" : ""}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} className={cls} disabled={disabled}>{children}</button>;
}
