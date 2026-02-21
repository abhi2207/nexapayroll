import { Card } from "@/components/Card";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { services, epf } from "@/components/content";

export default function ServicesPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading title="Services" desc="A simple overview of our core offerings — payroll operations plus EPF/ESI and compliance support." />
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((s) => (
                <Card key={s.title} title={s.title} eyebrow={s.eyebrow}>
                  {s.desc}
                </Card>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-lg font-semibold">EPF Compliance & Advisory Services</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Professional EPF consulting across India — guidance for registrations, compliance, audits/returns, withdrawals,
                and inspection readiness.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {epf.epfServices.map((e) => (
                  <div key={e.title} className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm font-semibold">{e.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{e.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
