"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Check, CheckCircle2, Copy, HelpCircle, Loader2, Mail, Send, TriangleAlert } from "lucide-react";
import { WeaveMark } from "@/components/ui/WeaveMark";

const CATEGORIES = [
  { id: "general", label: "General support", hint: "Tell us what you're trying to do and where you got stuck." },
  { id: "rules", label: "Custom shift rules", hint: "Describe the rule, e.g. “Cashiers can't work more than 5 days in a row.”" },
  { id: "enterprise", label: "Multi-store & enterprise", hint: "How many stores and staff do you have? Which tools do you use today?" },
  { id: "bug", label: "Report an issue", hint: "What happened, what you expected, and which page or file was involved." },
];

const CHANNELS = [
  { icon: Mail, title: "Technical & roster support", desc: "Files, solver rules, accounts", email: "support@orbit-scheduling.com", note: "Usually replies within 2 hours" },
  { icon: Building2, title: "Multi-unit & custom constraints", desc: "Enterprise rules and SLA setup", email: "sales@orbit-scheduling.com", note: "For teams with 3+ locations" },
];

const NEXT_STEPS = [
  "Our team reads your message.",
  "You get a reply by email, not a ticket queue.",
  "We fix the issue or set up your custom rules.",
];

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-[#2F5BFF] focus:outline-none focus:ring-4 focus:ring-[#2F5BFF]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:text-sm";

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot chống spam
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  const hint = CATEGORIES.find((c) => c.id === inquiryType)?.hint;

  // Chuyển focus tới thông báo thành công để screen reader đọc ngay
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const copyEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(address);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      window.location.href = `mailto:${address}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryType, name, email, company, message, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json().catch(() => ({}));
      setTicketId(data.ticketId ?? "");
      setSubmitted(true);
    } catch {
      setError("We couldn't send your message. Check your connection and try again, or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName(""); setEmail(""); setCompany(""); setMessage(""); setInquiryType("general");
    setSubmitted(false); setError("");
  };

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#F6F7FB] py-14 dark:bg-slate-950 sm:py-20">
      <WeaveMark className="pointer-events-none absolute -right-24 -top-24 w-[26rem] opacity-[0.05]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-2xl sm:mb-16">
          <h1 className="text-4xl font-display font-extrabold leading-[1.06] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            How can we help your team?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            Questions about custom shift rules, roster imports or multi-store setups? Tell us what you need and we&apos;ll point you in the right direction.
          </p>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Trái: kênh liên hệ */}
          <aside className="space-y-8 lg:col-span-5">
            <div className="divide-y divide-slate-200/80 overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {CHANNELS.map(({ icon: Icon, title, desc, email: addr, note }) => (
                <div key={addr} className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2F5BFF]/10 text-[#2F5BFF]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                      <div className="mt-3 flex items-center gap-1">
                        <a href={`mailto:${addr}`} className="truncate text-sm font-semibold text-[#2F2C59] underline-offset-4 hover:text-[#2F5BFF] hover:underline dark:text-slate-100">
                          {addr}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyEmail(addr)}
                          aria-label={`Copy ${addr}`}
                          className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                        >
                          {copied === addr ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{note}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/faq" className="group flex items-center gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF7A59]/12 text-[#E8613F]">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">Check the FAQ first</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">Quick answers on imports, templates and solver rules</span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#2F5BFF]" />
              </Link>
            </div>

            {/* Chuỗi các bước thật nên có đánh số */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">What happens next</h2>
              <ol className="mt-4 space-y-3">
                {NEXT_STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F2C59] text-xs font-bold text-white dark:bg-white dark:text-[#2F2C59]">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Phải: form */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(47,44,89,0.25)] dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              {submitted ? (
                <div className="space-y-5 py-10 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h2 ref={successRef} tabIndex={-1} className="text-2xl font-display font-extrabold text-[#2F2C59] outline-none dark:text-white">
                    Message sent
                  </h2>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Thanks, <strong className="text-slate-900 dark:text-white">{name}</strong>. We&apos;ll reply to{" "}
                    <strong className="text-slate-900 dark:text-white">{email}</strong>. Check your spam folder if you don&apos;t see us soon.
                  </p>
                  {ticketId && (
                    <p className="text-xs text-slate-500">
                      Reference <span className="rounded-md bg-slate-100 px-2 py-1 font-mono font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">{ticketId}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="cursor-pointer rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset>
                    <legend className="mb-2.5 text-sm font-semibold text-slate-900 dark:text-white">What&apos;s this about?</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {CATEGORIES.map((cat) => (
                        <label key={cat.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="inquiryType"
                            value={cat.id}
                            checked={inquiryType === cat.id}
                            onChange={() => setInquiryType(cat.id)}
                            className="peer sr-only"
                          />
                          <span className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-300 peer-checked:border-[#2F2C59] peer-checked:bg-[#2F2C59] peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-[#2F5BFF]/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:peer-checked:bg-white dark:peer-checked:text-[#2F2C59]">
                            {cat.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-sm font-medium text-slate-800 dark:text-slate-200">Your name</label>
                      <input id="contact-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" className={field} />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-sm font-medium text-slate-800 dark:text-slate-200">Work email</label>
                      <input id="contact-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@company.com" className={field} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-company" className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Store or organization <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input id="contact-company" type="text" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Apex Health Clinic" className={field} />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-sm font-medium text-slate-800 dark:text-slate-200">Message</label>
                    <textarea id="contact-message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={hint} className={`${field} resize-y`} />
                  </div>

                  {/* Honeypot: người thật không thấy, bot sẽ điền */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
                  </div>

                  {error && (
                    <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        {error}{" "}
                        <a href="mailto:support@orbit-scheduling.com" className="font-semibold underline underline-offset-2">support@orbit-scheduling.com</a>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">We only use your details to reply to this message.</p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary min-h-11 px-7 py-3 text-sm gap-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {loading ? "Sending…" : "Send message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}