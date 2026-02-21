import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { about } from "@/components/content";

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading title={about.title} desc={about.desc} />
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="text-sm font-semibold">What we help with</div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              {about.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
              <div className="font-semibold">Our approach</div>
              <p className="mt-2 leading-6">{about.mission}</p>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
