import { Card } from "@/components/Card";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { services } from "@/components/content";

export default function ServicesPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading
            title="Payroll Services"
            desc="A simple overview of our core offerings — payroll operations and compliance support."
          />
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

            {/* EPF/ESI details live on the dedicated EPF/ESI page */}
          </div>

          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
