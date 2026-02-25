"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

type Profile = {
  clientId?: string;
  clientName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  phone?: string;
  address?: string;
};

async function authHeader() {
  const session = await fetchAuthSession();
  // API Gateway JWT authorizer expects the ACCESS token
  const token = session.tokens?.accessToken?.toString();
  if (!token) throw new Error("Not logged in");
  return { Authorization: `Bearer ${token}` };
}

export default function PortalPage() {
  const [me, setMe] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [msg, setMsg] = useState<string>("");

  // Form fields (only used when profile is missing)
  const [clientName, setClientName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function loadSessionAndProfile() {
    setLoading(true);
    setMsg("");

    // 1) Resolve auth first; do NOT clear auth state if API calls fail.
    try {
      const u = await getCurrentUser();
      setMe((u as any)?.signInDetails?.loginId || (u as any)?.username || (u as any)?.userId || "");
    } catch {
      setMe("");
      setProfile(null);
      setLoading(false);
      return;
    }

    // 2) Then load profile (best-effort)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        setMsg("Missing NEXT_PUBLIC_API_BASE_URL in .env.local");
        setProfile(null);
        setLoading(false);
        return;
      }

      const headers = { ...(await authHeader()) };
      const res = await fetch(`${baseUrl}/profile`, { method: "GET", headers });

      if (res.status === 404) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const out = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        setMsg(out?.error || `Unable to load profile (${res.status})`);
        setProfile(null);
        setLoading(false);
        return;
      }

      const p = out?.profile || out;
      setProfile(p);
      // Keep a local copy of clientId (used by uploads page)
      if (p?.clientId && typeof window !== "undefined") {
        localStorage.setItem("nexaClientId", p.clientId);
      }
    } catch (e: any) {
      setProfile(null);
      setMsg(e?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessionAndProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signedIn = !!me;

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container max-w-3xl">
          <SectionHeading title="Client Portal" desc="View your profile and upload documents securely." />

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={loadSessionAndProfile}>
              Refresh session
            </Button>
            <Button variant="secondary" href="/portal/upload/">
              Go to Uploads
            </Button>
          </div>

          {signedIn ? (
            <div className="mt-3 text-sm text-slate-600">
              Signed in as: <span className="font-semibold">{me}</span>
            </div>
          ) : (
            <div className="mt-3 text-sm text-slate-600">
              You are not signed in. <a className="underline" href="/login/">Go to Login</a>
            </div>
          )}

          {msg ? <div className="mt-3 text-sm text-slate-700">{msg}</div> : null}
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            {loading ? (
              <div className="text-sm text-slate-600">Loading…</div>
            ) : !signedIn ? (
              <div>
                <div className="text-lg font-semibold">Please log in</div>
                <p className="mt-2 text-sm text-slate-600">
                  Log in to access your client profile and uploads.
                </p>
                <div className="mt-6">
                  <Button href="/login/">Go to Login</Button>
                </div>
              </div>
            ) : profile ? (
              <div>
                <div className="text-lg font-semibold">Client Overview</div>
                <p className="mt-2 text-sm text-slate-600">Your profile is set up. You can upload documents anytime.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <div className="text-xs font-semibold text-slate-500">Client / Company</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{profile.clientName || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Primary Email</div>
                    <div className="mt-1 text-sm text-slate-800">{profile.primaryContactEmail || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Primary Phone</div>
                    <div className="mt-1 text-sm text-slate-800">{profile.primaryContactPhone || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Phone</div>
                    <div className="mt-1 text-sm text-slate-800">{profile.phone || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Address</div>
                    <div className="mt-1 text-sm text-slate-800">{profile.address || "—"}</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/portal/upload/">Go to Uploads</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg font-semibold">Create your profile</div>
                <p className="mt-2 text-sm text-slate-600">
                  Fill this once. We use it to create your client folder and save your registration record to our master data bucket.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Client name (required)</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Company / Client name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Primary contact email</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                      placeholder="primary@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Primary contact phone</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      placeholder="+91 ______ ______"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ______ ______"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Address (optional)</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                    />
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

                      try {
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

                        setMsg("Profile saved ✅");
                        if (out?.clientId && typeof window !== "undefined") {
                          localStorage.setItem("nexaClientId", out.clientId);
                        }
                        await loadSessionAndProfile();
                      } catch (e: any) {
                        setMsg(e?.message || "Profile save failed");
                      }
                    }}
                  >
                    Save Profile
                  </Button>

                  <Button variant="secondary" href="/portal/upload/">
                    Go to Uploads
                  </Button>
                </div>

                {msg ? <div className="mt-4 text-sm text-slate-700">{msg}</div> : null}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
