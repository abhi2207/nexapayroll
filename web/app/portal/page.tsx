"use client";

import { useState } from "react";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { configureAmplify } from "@/lib/amplify";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

async function authHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("Not logged in");
  return { Authorization: `Bearer ${token}` };
}

export default function PortalPage() {
  configureAmplify();

  const [clientName, setClientName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const [me, setMe] = useState<string>("");

  async function loadMe() {
    try {
      const u = await getCurrentUser();
      setMe(u.username || "");
    } catch {
      setMe("");
    }
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container max-w-3xl">
          <SectionHeading title="Client Portal" desc="Create your profile and upload documents securely." />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={loadMe}>Refresh session</Button>
            <Button variant="secondary" href="/portal/upload/">Go to Upload</Button>
            <Button
              variant="ghost"
              onClick={async () => {
                await signOut();
                window.location.href = "/login/";
              }}
            >
              Logout
            </Button>
          </div>
          {me ? <div className="mt-3 text-sm text-slate-600">Signed in as: <span className="font-semibold">{me}</span></div> : null}
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="text-lg font-semibold">Profile</div>
            <p className="mt-2 text-sm text-slate-600">
              Fill this once. We use it to create your client folder and save your registration record to our master data bucket.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Client name (required)</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Company / Client name" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Primary contact email</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  value={primaryEmail} onChange={(e) => setPrimaryEmail(e.target.value)} placeholder="primary@email.com" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Primary contact phone</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  value={primaryPhone} onChange={(e) => setPrimaryPhone(e.target.value)} placeholder="+91 ______ ______" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ______ ______" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Address (optional)</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={async () => {
                  setMsg("");
                  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                  if (!baseUrl) {
                    setMsg("Missing NEXT_PUBLIC_API_BASE_URL in .env.local");
                    return;
                  }

                  const headers = { "content-type": "application/json", ...(await authHeader()) };
                  const res = await fetch(`${baseUrl}/profile`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                      clientName,
                      primaryContactEmail: primaryEmail,
                      primaryContactPhone: primaryPhone,
                      phone,
                      address,
                    }),
                  });

                  const out = await res.json().catch(() => ({} as any));
                  if (!res.ok) {
                    setMsg(out?.error || `Profile save failed (${res.status})`);
                    return;
                  }

                  setMsg(`Profile saved ✅ clientId=${out.clientId}`);
                  if (typeof window !== "undefined") localStorage.setItem("nexaClientId", out.clientId);
                }}
              >
                Save Profile
              </Button>

              <Button variant="secondary" href="/portal/upload/">Upload documents</Button>
            </div>

            {msg ? <div className="mt-4 text-sm text-slate-700">{msg}</div> : null}
            <div className="mt-4 text-xs text-slate-500">
              Note: If you see “Not logged in”, go to <a className="underline" href="/login/">Login</a> first.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
