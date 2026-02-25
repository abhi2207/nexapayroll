"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Button } from "@/components/Button";

type UploadItem = { key: string; size: number; lastModified: string };

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAccessToken(): Promise<string> {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export function ClientUploads() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadUploads() {
    const token = await getAccessToken();
    const res = await fetch(`${API}/uploads`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `List failed (${res.status})`);
    setItems(data.items || []);
  }

  useEffect(() => {
    // best effort; if logged out, ignore
    loadUploads().catch(() => {});
  }, []);

  function openPicker() {
    setErr(null);
    fileRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setErr(null);

    try {
      const token = await getAccessToken();

      // 1) get presigned PUT url
      const presignRes = await fetch(`${API}/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      const presign = await presignRes.json().catch(() => ({}));
      if (!presignRes.ok) throw new Error(presign?.error || `Presign failed (${presignRes.status})`);

      // 2) PUT file to S3
      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) throw new Error(`Upload failed (${putRes.status})`);

      // 3) refresh list
      await loadUploads();
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      // allow re-selecting the same file
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function download(key: string) {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API}/download-url?key=${encodeURIComponent(key)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Download failed (${res.status})`);
      window.location.href = data.downloadUrl;
    } catch (e: any) {
      setErr(e?.message || "Download failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={openPicker} variant="primary" disabled={busy}>
          {busy ? "Uploading..." : "Upload documents"}
        </Button>

        <input ref={fileRef} type="file" className="hidden" onChange={onFileSelected} />

        <Button onClick={() => loadUploads()} variant="secondary" disabled={busy}>
          Refresh
        </Button>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3 font-medium">Your uploads</div>
        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-sm text-slate-600">No uploads yet.</div>
          ) : (
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.key} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{it.key.split("/").pop()}</div>
                    <div className="text-xs text-slate-600">
                      {(it.size / 1024).toFixed(1)} KB • {new Date(it.lastModified).toLocaleString()}
                    </div>
                  </div>
                  <Button onClick={() => download(it.key)} variant="secondary">
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}