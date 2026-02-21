"use client";

import { useEffect, useRef, useState } from "react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { configureAmplify } from "@/lib/amplify";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

type UploadItem = { key: string; size: number; lastModified: string };

async function authHeader() {
  const session = await fetchAuthSession();
  // ✅ Use ACCESS token for API Gateway JWT authorizer
  const token = session.tokens?.accessToken?.toString();
  if (!token) throw new Error("Not logged in");
  return { Authorization: `Bearer ${token}` };
}

export default function PortalUploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [me, setMe] = useState("");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    configureAmplify();

    loadMe();
    loadUploads().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMe() {
    try {
      const u = await getCurrentUser();
      setMe(u.username || "");
    } catch {
      setMe("");
    }
  }

  async function loadUploads() {
    setErr("");
    setMsg("");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setErr("Missing NEXT_PUBLIC_API_URL in .env.local");
      return;
    }

    const headers = await authHeader();
    const res = await fetch(`${baseUrl}/uploads`, { method: "GET", headers });
    const out = await res.json().catch(() => ({} as any));
    if (!res.ok) {
      setErr(out?.error || `Failed to load uploads (${res.status})`);
      return;
    }

    setItems(out.items || []);
  }

  function openPicker() {
    setErr("");
    setMsg("");
    fileRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setErr("");
    setMsg("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");

      const headers = { "content-type": "application/json", ...(await authHeader()) };

      // 1) Request presigned PUT URL
      const presignRes = await fetch(`${baseUrl}/upload-url`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      const presign = await presignRes.json().catch(() => ({} as any));
      if (!presignRes.ok) {
        throw new Error(presign?.error || `Presign failed (${presignRes.status})`);
      }

      // 2) Upload file using presigned URL
      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) throw new Error(`Upload failed (${putRes.status})`);

      setMsg("Upload complete ✅");
      await loadUploads();
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function download(key: string) {
    try {
      setErr("");
      setMsg("");

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");

      const headers = await authHeader();
      const res = await fetch(`${baseUrl}/download-url?key=${encodeURIComponent(key)}`, {
        method: "GET",
        headers,
      });

      const out = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(out?.error || `Download failed (${res.status})`);

      window.location.href = out.downloadUrl;
    } catch (e: any) {
      setErr(e?.message || "Download failed");
    }
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container max-w-3xl">
          <SectionHeading title="Upload Documents" desc="Upload and download your secure payroll documents." />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" href="/portal/">
              Back to Portal
            </Button>
            <Button variant="secondary" onClick={loadUploads} disabled={busy}>
              Refresh
            </Button>
          </div>
          {me ? (
            <div className="mt-3 text-sm text-slate-600">
              Signed in as: <span className="font-semibold">{me}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={openPicker} disabled={busy}>
                {busy ? "Uploading..." : "Choose file to upload"}
              </Button>

              <input ref={fileRef} type="file" className="hidden" onChange={onFileSelected} />

              <div className="text-sm text-slate-600">
                Files upload into your client folder automatically (based on your login).
              </div>
            </div>

            {msg ? <div className="mt-4 text-sm text-green-700">{msg}</div> : null}
            {err ? <div className="mt-4 text-sm text-red-600">{err}</div> : null}

            <div className="mt-6 rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3 font-medium">Your uploads</div>
              <div className="p-4">
                {items.length === 0 ? (
                  <div className="text-sm text-slate-600">No uploads yet.</div>
                ) : (
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li
                        key={it.key}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{it.key.split("/").pop()}</div>
                          <div className="text-xs text-slate-600">
                            {(it.size / 1024).toFixed(1)} KB • {new Date(it.lastModified).toLocaleString()}
                          </div>
                        </div>
                        <Button variant="secondary" onClick={() => download(it.key)}>
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              If you see “Not logged in”, go to <a className="underline" href="/login/">Login</a> first.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}