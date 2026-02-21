export const contact = {
  phone: "+91 73900 55759",
  email: "support@nexapayroll.com",
  location: "New Delhi",
  hours: "Mon–Sat, 9am–6pm",
};

export const home = {
  badge: "Payroll • EPF/ESI • Compliance",
  headline: "Payroll, EPF/ESI, and filing help — simplified",
  subhead:
    "Practical guidance for payroll setup, monthly compliance, and employee changes. Fast support via phone or email for Delhi/NCR businesses.",
  highlights: ["Mon–Sat • 9am–6pm", "Onboarding + monthly runs", "EPF/ESI + compliance reminders"],
};

export const services = [
  { title: "Payroll processing", eyebrow: "Monthly cycle", desc: "Monthly run, payslips, attendance inputs, deductions — with predictable timelines and clear inputs." },
  { title: "Payroll onboarding", eyebrow: "Start correctly", desc: "Setup checklist, timelines, and first-run support so your payroll process starts clean and stays consistent." },
  { title: "Compliance & filings", eyebrow: "Stay compliant", desc: "Guidance for recurring filings and documentation readiness, plus reminders to reduce missed deadlines." },
  { title: "EPF/ESI support", eyebrow: "Employee-friendly", desc: "Guidance, documentation checks, and help with common employee EPF/ESI questions and portal steps." },
  { title: "HR ops support", eyebrow: "Operations", desc: "Offer letters, onboarding checklist, employee master maintenance, and change tracking." },
  { title: "Reporting", eyebrow: "Visibility", desc: "Monthly summaries and basic compliance-ready reporting so owners and ops teams stay aligned." },
];

export const epf = {
  heroTitle: "EPF guidance (India)",
  heroDesc: "Practical, employee-friendly EPF support: what’s needed, what to check, and how to avoid common delays.",
  whatIsTitle: "What is an Employees Provident Fund (EPF)?",
  whatIsDesc:
    "The Employee Provident Fund (EPF) is a savings fund managed by the Employee Provident Fund Organisation (EPFO), Government of India. It is a low-risk, government-backed scheme that helps employees build long-term retirement savings and supports financial needs during emergencies.",
  lifecycle:
    "We guide you through the EPF lifecycle — legal applicability, statutory compliance, documentation readiness, and handling notices/penalties — to keep things smooth for both employers and employees.",
  blocks: [
    {
      title: "Contribution basics",
      desc: "Employee contribution is commonly 12% (or 10% in certain eligible cases). Employer contribution is split, including 8.33% towards EPS (subject to EPFO rules and wage ceilings).",
      cta: "Know the split",
    },
    {
      title: "e‑Nomination",
      desc: "e‑Nomination can be completed in the UAN portal after Aadhaar verification, typically via OTP-based e-sign.",
      cta: "Avoid claim issues",
    },
    {
      title: "Online claims",
      desc: "Many online claims are initiated in the UAN portal under “Claim (Form-31, 19, 10C & 10D)” after KYC is approved.",
      cta: "Faster processing",
    },
  ],
  epfServices: [
    { title: "Employer Registration", desc: "Quick and hassle-free EPFO registration for organizations." },
    { title: "EPF Compliance", desc: "Meet EPF compliance requirements with checklists, reminders, and documentation support." },
    { title: "EPF Audits & Returns", desc: "Complete PF audit & filing support and inspection readiness." },
    { title: "PF Withdrawal Assistance", desc: "Fast, hassle-free guidance for EPF withdrawals and claim processing." },
    { title: "EPF Inspection Support", desc: "Help during inspections, notices, audits, and departmental queries." },
    { title: "Employer Change / Transfer Support", desc: "Step-by-step assistance for EPF transfer when switching employers." },
  ],
  whyChooseUs: [
    { title: "Hand of support", desc: "Online support for registering and monitoring the EPF process with timely execution and cooperation." },
    { title: "Guide to EPF", desc: "Guidance on EPF registration, user manuals, and digital signature requirements for smooth online filing." },
    { title: "Authenticity", desc: "Efficient, secure, hassle-free EPF support through verified processes, backed by a strong reputation." },
  ],
};

export const about = {
  title: "About Nexa Payroll",
  desc: "Nexa Payroll provides payroll operations and EPF-related support for small and mid-size businesses. We focus on clear communication, predictable monthly cycles, and documentation readiness.",
  bullets: [
    "Payroll onboarding, monthly payroll processing, payslip support",
    "Compliance guidance and documentation checklists",
    "Employee lifecycle changes (onboarding/offboarding updates)",
    "EPF/ESI support: UAN issues, e‑nomination, online claims, KYC checks",
    "EPF audits/returns and inspection readiness for organizations",
  ],
  mission:
    "Our goal is to make payroll and statutory compliance feel simple and reliable — with human-friendly explanations, clear checklists, and quick turnaround for common issues.",
};

export const contactPage = {
  title: "Contact",
  desc: "Reach out and we’ll respond as quickly as possible during support hours.",
  note:
    "Phase 2: If you want a real contact form submission, we can connect this to AWS SES via API Gateway + Lambda (or Supabase). For now, email/phone works great.",
};
