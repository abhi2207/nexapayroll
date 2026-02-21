"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Button } from "./Button";

const nav = [
  { href: "/portal/", label: "Portal" },
  { href: "/services/", label: "Services" },
  { href: "/epf/", label: "EPF" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [userLabel, setUserLabel] = useState<string>("");

  const refreshAuth = async () => {
    setChecking(true);
    try {
      const u = await getCurrentUser(); // Amplify v6
      setIsAuthed(true);
      // u.signInDetails?.loginId is often email; fallback to username/userId
      const label =
        (u as any)?.signInDetails?.loginId ||
        (u as any)?.username ||
        (u as any)?.userId ||
        "Signed in";
      setUserLabel(label);
    } catch {
      setIsAuthed(false);
      setUserLabel("");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    refreshAuth();
    // re-check auth when tab regains focus (common after redirect/login)
    const onFocus = () => refreshAuth();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-check whenever route changes (client nav)
  useEffect(() => {
    refreshAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    setIsAuthed(false);
    setUserLabel("");
    window.location.href = "/"; // hard reload so everything is consistent
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">N</span>
          <span>Nexa Payroll</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/contact/" variant="secondary" className="hidden sm:inline-flex">
            Contact Us
          </Button>

          {!checking && isAuthed && (
            <>
              <span className="hidden md:inline text-sm text-slate-600 max-w-[240px] truncate">
                {userLabel}
              </span>
              <Button href="/portal/" variant="secondary" className="hidden sm:inline-flex">
                Portal
              </Button>
              <Button onClick={handleLogout} variant="primary">
                Logout
              </Button>
            </>
          )}

          {!checking && !isAuthed && (
            <>
              <Button href="/signup/" variant="secondary" className="hidden sm:inline-flex">
                Sign up
              </Button>
              <Button href="/login/" variant="primary">
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}