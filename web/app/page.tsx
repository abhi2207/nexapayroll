import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { about, contact, epf, home, services as serviceCards } from "@/components/content";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="container py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-soft">
                {home.badge}
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {home.headline}
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">{home.subhead}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/contact/">Contact Us</Button>
                <Button href="/services/" variant="secondary">See Services</Button>
                <Button href="/epf/" variant="secondary">EPF Support</Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {home.highlights.map((h) => (
                  <div key={h} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                    <div className="text-sm font-semibold">{h}</div>
                    <div className="mt-1 text-xs text-slate-600">{contact.location}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-white p-5 shadow-soft">
                <div className="text-sm font-semibold text-slate-900">Local, responsive support</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Clear checklists and reminders</li>
                  <li>• Human-friendly explanations (no jargon)</li>
                  <li>• Quick turnaround for common fixes</li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Need EPF help?</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                If you’re stuck with UAN issues, e‑nomination, or online claims, we can guide you through the common steps
                and avoid delays.
              </p>
              <div className="mt-5">
                <Button href="/epf/">Go to EPF Support →</Button>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
                <div className="font-semibold">Quick contact</div>
                <div className="mt-2">Email: <span className="font-semibold">{contact.email}</span></div>
                <div className="mt-1">Phone/WhatsApp: <span className="font-semibold">{contact.phone}</span></div>
                <div className="mt-1">Hours: <span className="font-semibold">{contact.hours}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <SectionHeading
            kicker="What we help with"
            title="A clear snapshot of the most common requests we support"
            desc="Payroll onboarding, monthly cycles, compliance checklists, and EPF/ESI guidance — with simple steps and fast communication."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((s) => (
              <Card key={s.title} title={s.title} eyebrow={s.eyebrow}>
                {s.desc}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading kicker="EPF support" title={epf.whatIsTitle} desc={epf.whatIsDesc} />
          <p className="mt-6 max-w-4xl text-sm leading-6 text-slate-600">{epf.lifecycle}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {epf.blocks.map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="text-lg font-semibold">{b.title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{b.desc}</p>
                <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">{b.cta}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button href="/epf/" variant="primary">Explore EPF Support</Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              kicker="Get in touch"
              title="Questions? Onboarding? Monthly compliance?"
              desc="Reach out for payroll setup, monthly runs, EPF/ESI guidance, withdrawals, or inspection readiness."
            />
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm text-slate-700">
              <div className="font-semibold">Contact details</div>
              <div className="mt-2">Email: <span className="font-semibold">{contact.email}</span></div>
              <div className="mt-1">Phone/WhatsApp: <span className="font-semibold">{contact.phone}</span></div>
              <div className="mt-1">Hours: <span className="font-semibold">{contact.hours}</span></div>
              <div className="mt-1">Location: <span className="font-semibold">{contact.location}</span></div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-sm font-semibold">About</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{about.desc}</p>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
