import Link from "next/link";
import { Card } from "@/components/Card";
import { EnquiryForm } from "@/components/EnquiryForm";
import { about, contact, home, services } from "@/components/content";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-[56rem] -translate-x-1/2 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-slate-200/70 blur-3xl" />
      </div>

      <div className="container py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Badge>{home.badge}</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {home.headline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              {home.subhead}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact/"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Talk to an Expert
              </Link>
              <Link
                href="/services/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                View Services
              </Link>
              <Link
                href="/portal/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Client Portal
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {home.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Quick contact</div>
              <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="font-medium">{contact.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Phone / WhatsApp</div>
                  <div className="font-medium">{contact.phone}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {contact.hours} • {contact.location}
              </div>
            </div>
          </div>

          {/* image block */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* Use an image you already have in /public/assets/ */}
              <img
                src="/assets/hero-office.jpg"
                alt="Nexa Payroll"
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block">
              <div className="text-xs font-semibold text-slate-500">Support</div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                Fast responses via email & phone
              </div>
              <div className="mt-1 text-xs text-slate-500">Mon–Sat • 9am–6pm</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureGrid() {
  return (
    <section className="container py-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold text-slate-500">Services</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            A clear snapshot of what we can help with
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Predictable monthly cycles, compliance guidance, and employee change support —
            with simple checklists and clean communication.
          </p>
        </div>
        <Link
          href="/services/"
          className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 md:inline-flex"
        >
          See all services
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <div className="text-xs font-semibold text-slate-500">{s.eyebrow}</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{s.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:hidden">
        <Link
          href="/services/"
          className="inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
        >
          See all services
        </Link>
      </div>
    </section>
  );
}

export function AboutCTA() {
  return (
    <section className="container py-14">
      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold text-slate-500">Why Nexa Payroll</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Clear guidance. Quick turnaround. No jargon.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            {about.desc}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about/"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              About us
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Use an existing image you already deploy */}
          <img
            src="/assets/delhi-skyline.jpg"
            alt="Nexa Payroll - New Delhi"
            className="h-[260px] w-full object-cover md:h-[320px]"
          />
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="container py-14">
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">Get in touch</h2>
          <p className="mt-2 text-sm text-slate-600">
            Questions about onboarding, monthly payroll, EPF/ESI, withdrawals, or filings?
            Send a note — we’ll respond during support hours.
          </p>

          <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5">
            <div>
              <div className="text-xs font-semibold text-slate-500">Email</div>
              <div className="mt-1 text-sm font-medium text-slate-900">{contact.email}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Phone / WhatsApp</div>
              <div className="mt-1 text-sm font-medium text-slate-900">{contact.phone}</div>
            </div>
            <div className="text-xs text-slate-500">
              {contact.hours} • {contact.location}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Keeps your existing email/SES integration */}
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}