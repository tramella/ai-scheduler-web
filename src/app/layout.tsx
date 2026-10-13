import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";

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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F6F7FB] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#2F5BFF]/20 selection:text-[#2F2C59] transition-colors">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppLayoutShell>{children}</AppLayoutShell>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


