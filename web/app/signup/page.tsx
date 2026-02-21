"use client";

import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { configureAmplify } from "@/lib/amplify";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

export default function SignupPage() {
  configureAmplify();

  const [stage, setStage] = useState<"signup" | "confirm">("signup");

  // Cognito auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Confirmation
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  // Client profile fields (collected at signup, saved locally, submitted later in /portal)
  const [clientName, setClientName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhone, setPrimaryContactPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container max-w-2xl">
          <SectionHeading
            title="Create account"
            desc="Sign up with your email. You’ll receive a verification code."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-lg">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            {stage === "signup" ? (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMsg("");

                  // Save client profile details locally so Portal can auto-fill after login
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "nexaPendingProfile",
                      JSON.stringify({
                        clientName,
                        primaryContactEmail,
                        primaryContactPhone,
                        phone,
                        address,
                      })
                    );
                  }

                  await signUp({
                    username: email,
                    password,
                    options: { userAttributes: { email } },
                  });

                  setStage("confirm");
                  setMsg("Verification code sent to your email.");
                }}
              >
                {/* Client details */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    Client details
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    We’ll use these to create your portal profile after you log in.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Client name
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Company / Client name"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Primary contact email
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        value={primaryContactEmail}
                        onChange={(e) => setPrimaryContactEmail(e.target.value)}
                        placeholder="primary@company.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Primary contact phone
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        value={primaryContactPhone}
                        onChange={(e) => setPrimaryContactPhone(e.target.value)}
                        placeholder="+91 ______ ______"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Phone (optional)
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 ______ ______"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Address (optional)
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                      />
                    </div>
                  </div>
                </div>

                {/* Auth details */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="Create a password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign up
                </Button>

                {msg ? <p className="text-sm text-slate-600">{msg}</p> : null}
                <p className="text-xs text-slate-500">
                  Already have an account? Go to{" "}
                  <a className="underline" href="/login/">
                    Login
                  </a>
                  .
                </p>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMsg("");
                  await confirmSignUp({
                    username: email,
                    confirmationCode: code,
                  });
                  setMsg("Confirmed ✅ You can now login.");
                }}
              >
                <div className="text-sm text-slate-600">
                  Confirm for:{" "}
                  <span className="font-semibold">{email}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Verification code
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Confirm
                </Button>

                {msg ? <p className="text-sm text-slate-600">{msg}</p> : null}
                <p className="text-xs text-slate-500">
                  Go to{" "}
                  <a className="underline" href="/login/">
                    Login
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}