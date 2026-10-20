import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
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


