import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ORBIT — AI-Powered Workforce Scheduling Platform",
  description:
    "Upload your employee data, specify shift requirements in plain text, and generate conflict-free, mathematically validated schedules in seconds.",
  icons: {
    icon: "/images/logo/orbit-weave-app-icon.svg",
    shortcut: "/images/logo/orbit-weave-symbol-light-bg.svg",
    apple: "/images/logo/orbit-weave-app-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F6F7FB] text-slate-900 font-sans selection:bg-[#2F5BFF]/20 selection:text-[#2F2C59]">
        <PublicHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <PublicFooter />
      </body>
    </html>
  );
}
