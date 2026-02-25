"use client";

import { useState } from "react";
import { Button } from "./Button";

type State = "idle" | "submitting" | "sent";

export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      phone: String(form.get("phone") || ""),
      message: String(form.get("message") || ""),
      sourcePage: typeof window !== "undefined" ? window.location.href : "",
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!baseUrl) {
      setState("idle");
      setError("Contact form is not configured yet (missing NEXT_PUBLIC_API_BASE_URL).");
      return;
    }

    const res = await fetch(`${baseUrl}/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setState("idle");
      const txt = await res.text().catch(() => "");
      setError(`Submit failed (${res.status}). ${txt}`);
      return;
    }

    setState("sent");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="text-lg font-semibold">Get in touch</div>
      <p className="mt-1 text-sm text-slate-600">
        Questions about onboarding, monthly payroll, EPF/ESI, withdrawals, or compliance filings? Send a note.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" placeholder="name@company.com" type="email" />
        <Field label="Company" name="company" placeholder="Company name" />
        <Field label="Phone / WhatsApp" name="phone" placeholder="+91 ______ ______" />
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea name="message" rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Tell us what you need help with…"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={state !== "idle"}>
          {state === "idle" ? "Submit" : state === "submitting" ? "Submitting…" : "Sent ✓"}
        </Button>
        {error ? <span className="text-sm text-red-600">{error}</span> : state === "sent" ? <span className="text-sm text-slate-600">Thanks — we’ll respond during support hours.</span> : null}
      </div>
    </form>
  );
}

function Field({ label, name, placeholder, type = "text" }: { label: string; name: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input name={name} type={type} placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
      />
    </div>
  );
}
