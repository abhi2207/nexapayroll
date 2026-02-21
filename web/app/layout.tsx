import "./globals.css";
import type { Metadata } from "next";

import AmplifyConfig from "./amplify-config";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Nexa Payroll",
  description: "Payroll • EPF/ESI • Compliance (New Delhi)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AmplifyConfig />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}