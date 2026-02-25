import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { about } from "@/components/content";

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading
            title="About us"
            desc="Payroll operations and statutory compliance support — built for clarity, consistency, and on-time execution."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            {/* About Nexa Payroll */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {about.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{about.desc}</p>

              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {about.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>

              <p className="mt-6 text-sm leading-6 text-slate-600">{about.mission}</p>
            </div>

            {/* Management */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
              <div className="grid gap-6 md:grid-cols-[220px,1fr] md:items-start">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src="/assets/puneet-jain.jpg"
                    alt="Puneet Jain - Founder & Managing Director"
                    className="h-56 w-full object-cover"
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-500">Management</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                    Puneet Jain
                  </h3>
                  <div className="mt-1 text-sm font-medium text-slate-600">
                    Managing Director & Founder
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Puneet Jain is the Founder and Managing Director of Nexa Payroll Private Limited.
                    He holds an MBA from IMT Ghaziabad and a B.Com from Delhi University.
                    With 14+ years of experience in payroll services and EPF/ESI compliance, he built
                    Nexa Payroll from the ground up with a focus on reliability and clarity.
                    His approach is simple: predictable execution, clean documentation, and timely compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Keep the existing enquiry form on the right */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
