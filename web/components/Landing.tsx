import Link from "next/link";
import type React from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { about, contact, services } from "@/components/content";
import { CheckIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";

function PrimaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-blue-700"
    >
      {children}
    </Link>
  );
}

function SecondaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
    >
      {children}
    </Link>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="text-3xl font-extrabold text-blue-600">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
    </div>
  );
}

function ServiceCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-soft">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{desc}</div>
    </div>
  );
}

function SimpleIcon({ label }: { label: string }) {
  // lightweight icons without adding a library
  const common = "h-6 w-6";
  switch (label) {
    case "payroll":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path d="M7 3h10v18H7V3Z" stroke="currentColor" strokeWidth="2" />
          <path d="M9 7h6M9 11h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "compliance":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path d="M12 2 20 6v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="2" />
          <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "epf":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path d="M4 10 12 3l8 7v10a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1V10Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "self":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
          <path d="M19 8v6M16 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "attendance":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path d="M4 19V5m0 14h16M8 15l3-3 2 2 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function AlternatingFeature({
  title,
  desc,
  img,
  reverse,
}: {
  title: string;
  desc: string;
  img: string;
  reverse?: boolean;
}) {
  return (
    <section className="py-16">
      <div className={`container grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-600">{desc}</p>
          <Link href="/services/" className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline">
            Learn More →
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <img src={img} alt={title} className="h-[320px] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const serviceCards = [
    { title: "Payroll Onboarding", desc: services[0]?.desc ?? "", icon: <SimpleIcon label="self" /> },
    { title: "Payroll Processing", desc: services[1]?.desc ?? "", icon: <SimpleIcon label="payroll" /> },
    { title: "Compliance & Filings", desc: services[2]?.desc ?? "", icon: <SimpleIcon label="compliance" /> },
    { title: "EPF/ESI Digitalization", desc: services[3]?.desc ?? "", icon: <SimpleIcon label="epf" /> },
    { title: "HR Ops Support", desc: services[4]?.desc ?? "", icon: <SimpleIcon label="attendance" /> },
    { title: "Analytics & Reports", desc: services[5]?.desc ?? "", icon: <SimpleIcon label="analytics" /> },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="container py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Simplify Your Payroll & Compliance Management
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Streamline your HR operations with payroll and statutory compliance support — with clear communication and predictable monthly cycles.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  100% Compliance checklist driven
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  Automated EPF & ESI processing support
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  Real-time statutory updates & reminders
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryCta href="/contact/">Get Started →</PrimaryCta>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-soft">
                <img src="/assets/hero-team.png" alt="Nexa Payroll" className="h-[360px] w-full object-cover sm:h-[420px]" />
              </div>
              <div className="absolute -bottom-8 left-8">
                <StatPill value="14+" label="Years Experience" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16">
        <div className="container">
          <h2 className="text-center text-4xl font-extrabold tracking-tight">Our Services</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-slate-600">
            Comprehensive payroll and compliance solutions designed to simplify your HR operations.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((c) => (
              <ServiceCard key={c.title} title={c.title} desc={c.desc} icon={c.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY / FEATURES (alternating) */}
      <section id="features" className="bg-white">
        <div className="container pt-10">
          <h2 className="text-center text-4xl font-extrabold tracking-tight">Why choose us?</h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-base text-slate-600">
            Powerful capabilities designed to make payroll processing effortless and compliant.
          </p>
        </div>

        <AlternatingFeature
          title="Automated Compliance"
          desc="Stay ahead of regulatory changes with timely updates and automated compliance checks across statutory requirements."
          img="/assets/feature-compliance.png"
        />
        <AlternatingFeature
          title="Seamless EPF Management"
          desc="Simplify Employee Provident Fund operations with contribution tracking, documentation readiness, and hassle-free return filing support."
          img="/assets/feature-epf.png"
          reverse
        />
        <AlternatingFeature
          title="Smart Analytics Dashboard"
          desc="Make data-driven decisions with clear summaries, cost visibility, and compliance-ready reporting for audit readiness."
          img="/assets/feature-analytics.png"
        />
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16">
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">{about.title}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">{about.desc}</p>
              <p className="mt-4 text-base leading-7 text-slate-600">{about.mission}</p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <img src="/assets/about-team.png" alt="About Nexa Payroll" className="h-[320px] w-full object-cover" />
            </div>
          </div>

          <div className="mt-12 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <SimpleIcon label="self" />
              </div>
              <div className="mt-4 text-4xl font-extrabold">200+</div>
              <div className="mt-1 text-sm text-slate-600">Happy Clients</div>
            </div>
            <div>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2a15 15 0 0 1 0 20" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-4 text-4xl font-extrabold">10+</div>
              <div className="mt-1 text-sm text-slate-600">Cities Covered</div>
            </div>
            <div>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 10h12v11H6V10Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-4 text-4xl font-extrabold">14+</div>
              <div className="mt-1 text-sm text-slate-600">Years Experience</div>
            </div>
            <div>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-4 text-4xl font-extrabold">100%</div>
              <div className="mt-1 text-sm text-slate-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16">
        <div className="container">
          <h2 className="text-center text-4xl font-extrabold tracking-tight">Get in Touch</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-slate-600">
            Ready to streamline your payroll operations? Contact us today for a free consultation.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <PhoneIcon />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-sm text-slate-600">{contact.phone}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MailIcon />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-sm text-slate-600">{contact.email}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <PinIcon />
                  </div>
                  <div>
                    <div className="font-semibold">Office</div>
                    <div className="text-sm text-slate-600">{contact.location}</div>
                    <div className="text-xs text-slate-500">{contact.hours}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
                <img src="/assets/contact-table.png" alt="Contact" className="h-[320px] w-full object-cover" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
