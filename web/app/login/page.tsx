"use client";

import { getCurrentUser } from "aws-amplify/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthed(target = "/portal") {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await getCurrentUser();
        router.replace(target);
      } catch {
        // not logged in
      }
    })();
  }, [router, target]);
}

import { useState } from "react";
import { signIn, signOut } from "aws-amplify/auth";
import { configureAmplify } from "@/lib/amplify";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

export default function LoginPage() {
  useRedirectIfAuthed("/portal");
  configureAmplify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container max-w-2xl">
          <SectionHeading title="Login" desc="Sign in to access your portal and upload documents." />
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-lg">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setMsg("");
                await signIn({ username: email, password });
                window.location.href = "/portal/";
              }}
            >
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="Your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" className="w-full">Sign in</Button>

              {msg ? <p className="text-sm text-slate-600">{msg}</p> : null}
              <p className="text-xs text-slate-500">New user? Go to <a className="underline" href="/signup/">Create account</a>.</p>
            </form>

            <div className="mt-6">
              <Button
                variant="secondary"
                className="w-full"
                onClick={async () => {
                  await signOut();
                  setMsg("Signed out");
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
