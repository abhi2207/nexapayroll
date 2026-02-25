import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { contact, contactPage } from "@/components/content";

export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container">
          <SectionHeading title={contactPage.title} desc={contactPage.desc} />
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="text-sm font-semibold">Contact details</div>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div>Email: <span className="font-semibold">{contact.email}</span></div>
              <div>Phone/WhatsApp: <span className="font-semibold">{contact.phone}</span></div>
              <div>Support hours: <span className="font-semibold">{contact.hours}</span></div>
              <div>Location: <span className="font-semibold">{contact.location}</span></div>
            </div>
            {contactPage.note ? (
              <div className="mt-6 text-sm leading-6 text-slate-600">{contactPage.note}</div>
            ) : null}
          </div>

          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
