import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { epf } from "@/components/content";

export default function EPFPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading title={epf.heroTitle} desc={epf.heroDesc} />
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="text-sm font-semibold">{epf.applicabilityEPFTitle}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{epf.applicabilityEPFDesc}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="text-sm font-semibold">{epf.applicabilityESITitle}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{epf.applicabilityESIDesc}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {epf.blocks.map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="text-lg font-semibold">{b.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{b.desc}</p>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">{b.cta}</div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <SectionHeading
                kicker="Our services"
                title="EPF/ESI audits, compliance, withdrawals & inspections"
                desc="We provide comprehensive EPF/ESI solutions that simplify registration, compliance, withdrawals, and inspections."
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {epf.epfServices.map((s) => (
                  <Card key={s.title} title={s.title}>{s.desc}</Card>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <SectionHeading
                kicker="Why choose us"
                title="Reliable, compliant, hassle‑free support"
                desc="Trusted EPF/ESI consultancy delivering reliable guidance and smooth execution."
              />
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {epf.whyChooseUs.map((w) => (
                  <Card key={w.title} title={w.title}>{w.desc}</Card>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Button href="/contact/">Contact Support</Button>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
