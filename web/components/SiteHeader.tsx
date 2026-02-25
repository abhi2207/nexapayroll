"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Button } from "./Button";
import { ChevronDownIcon } from "./Icons";

const topNav = [
  { href: "/#features", label: "Why choose us?" },
  { href: "/about/", label: "About us" },
  { href: "/contact/", label: "Contact" },
];

const servicesNav = [
  { href: "/services/", label: "Payroll Services" },
  { href: "/epf/", label: "EPF / ESI Support" },
  { href: "/portal/", label: "Client Portal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [userLabel, setUserLabel] = useState<string>("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);


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
        <Link href="/" className="flex items-center gap-3 font-extrabold tracking-tight">
          <img src="/assets/logo-mark.png" alt="NexaPayroll" className="h-9 w-9 rounded-md object-cover" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimer.current) window.clearTimeout(closeTimer.current);
              setServicesOpen(true);
            }}
            onMouseLeave={() => {
              if (closeTimer.current) window.clearTimeout(closeTimer.current);
              closeTimer.current = window.setTimeout(() => setServicesOpen(false), 650);
            }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setServicesOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
            >
              Services <ChevronDownIcon className="h-4 w-4" />
            </button>

            <div
              className={`absolute left-0 top-full mt-1 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-soft transition ${
                servicesOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              {servicesNav.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => setServicesOpen(false)}
                >
                  {i.label}
                </Link>
              ))}
            </div>
          </div>

          {topNav.map((i) => (
            <Link key={i.href} href={i.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
              <Button href="/login/" variant="secondary" className="hidden sm:inline-flex">
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}