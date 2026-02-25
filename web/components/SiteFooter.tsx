import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-bold">Nexa Payroll</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">New Delhi • Payroll & Compliance Support</p>
            <p className="mt-3 text-sm text-slate-600">
              Phone: <span className="font-semibold">+91 73900 55759</span><br />
              Email: <span className="font-semibold">payrollnexa@nexapayroll.com</span><br />
              Hours: <span className="font-semibold">Mon–Sat, 9am–6pm</span>
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">Quick Links</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href="/services/" className="text-slate-700 hover:text-slate-900">Services</Link>
              <Link href="/epf/" className="text-slate-700 hover:text-slate-900">EPF Support</Link>
              <Link href="/about/" className="text-slate-700 hover:text-slate-900">About</Link>
              <Link href="/contact/" className="text-slate-700 hover:text-slate-900">Contact</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">Resources</div>
            <div className="mt-3 grid gap-2 text-sm">
              <a className="text-slate-700 hover:text-slate-900" href="https://www.epfindia.gov.in/" target="_blank" rel="noreferrer">EPFO</a>
              <a className="text-slate-700 hover:text-slate-900" href="https://labour.gov.in/" target="_blank" rel="noreferrer">Ministry of Labour & Employment</a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-500">© {new Date().getFullYear()} Nexa Payroll. All rights reserved.</div>
      </div>
    </footer>
  );
}
