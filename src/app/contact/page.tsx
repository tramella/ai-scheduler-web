"use client";

import React, { useState } from "react";
import {
  Mail,
  Building2,
  ArrowRight,
  LifeBuoy,
  Check,
  Copy,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState<string>("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState("");

  const inquiryCategories = [
    { id: "general", label: "General Support" },
    { id: "rules", label: "Custom Shift Rules" },
    { id: "enterprise", label: "Multi-Store & Enterprise" },
    { id: "bug", label: "Issue / Bug Report" },
  ];

  const handleCopyEmail = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedEmail(address);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setTicketId(`ORB-${randomNum}`);
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setSubmitted(false);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50/60 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Badge & Intro */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800 mb-4">
            <LifeBuoy className="h-3.5 w-3.5 text-slate-700" />
            <span>Support & Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2F2C59] leading-tight">
            How can we help your team?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Have questions about custom store shift constraints, roster imports, or multi-location setups? We typically respond in under 2 hours.
          </p>
        </div>

        {/* 2-Column Split: Info / Channels on Left, Clean Elevated Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Direct Channels & Information (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Direct Channels
              </h2>

              {/* Support Email Card */}
              <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Technical & Roster Support
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Help with files, solver rules, or accounts</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail("support@orbit-scheduling.com")}
                    className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                    title="Copy email"
                  >
                    {copiedEmail === "support@orbit-scheduling.com" ? (
                      <Check className="h-4 w-4 text-slate-900" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href="mailto:support@orbit-scheduling.com"
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    support@orbit-scheduling.com
                  </a>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                    <Clock className="h-3 w-3 mr-1 text-slate-500" /> &lt; 2h response
                  </span>
                </div>
              </div>

              {/* Enterprise / Sales Card */}
              <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Multi-Unit & Custom Constraints
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Custom enterprise rules and SLA setup</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail("sales@orbit-scheduling.com")}
                    className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                    title="Copy email"
                  >
                    {copiedEmail === "sales@orbit-scheduling.com" ? (
                      <Check className="h-4 w-4 text-slate-900" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href="mailto:sales@orbit-scheduling.com"
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    sales@orbit-scheduling.com
                  </a>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                    Dedicated engineer
                  </span>
                </div>
              </div>

              {/* Knowledge Base / FAQ Link */}
              <Link
                href="/faq"
                className="group block rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Browse Knowledge Base & FAQ
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Instant answers on templates and solver logic</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </div>

            {/* Reassurance Banner */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4.5 flex items-start space-x-3.5 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-slate-800 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-bold block mb-0.5">Human Roster Specialists on Standby</strong>
                Every inquiry is reviewed directly by scheduling specialists and product engineers. No automated runaround.
              </div>
            </div>

          </div>

          {/* Right Column: Clean Executive Contact Form (Span 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm">
              
              {submitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 border border-slate-200">
                    <CheckCircle2 className="h-8 w-8 text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      Ticket #{ticketId}
                    </span>
                    <h3 className="text-2xl font-black text-[#2F2C59]">Message Received</h3>
                  </div>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{name}</strong>. Our team has received your inquiry regarding <strong className="text-slate-900">{company || "your organization"}</strong>. We will reply to <strong className="text-slate-900">{email}</strong> within 2 hours.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-xl bg-[#2F2C59] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1E1B3A] transition shadow-xs border border-[#2F2C59]"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Category Pill Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Inquiry Subject
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {inquiryCategories.map((cat) => {
                        const isSelected = inquiryType === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setInquiryType(cat.id)}
                            className={`px-3 py-2 text-xs font-medium rounded-xl text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#2F2C59] text-white shadow-xs font-semibold"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-800">
                        Your Name <span className="text-slate-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#2F2C59] focus:ring-4 focus:ring-[#2F2C59]/10 transition-all outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-800">
                        Work Email <span className="text-slate-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#2F2C59] focus:ring-4 focus:ring-[#2F2C59]/10 transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Store / Organization Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-company" className="block text-xs font-semibold text-slate-800">
                      Store or Organization Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Health Clinic / Blue Bottle San Francisco"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#2F2C59] focus:ring-4 focus:ring-[#2F2C59]/10 transition-all outline-hidden"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-800">
                      Message Details <span className="text-slate-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your team size, custom shift constraints, or any questions you have..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#2F2C59] focus:ring-4 focus:ring-[#2F2C59]/10 transition-all outline-hidden"
                    />
                  </div>

                  {/* Footer & Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      We never share or sell your contact information.
                    </span>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2F2C59] px-7 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#1E1B3A] disabled:opacity-50 transition-all active:scale-[0.99] border border-[#2F2C59] cursor-pointer"
                    >
                      <Send className="h-4 w-4 text-white" />
                      <span>{loading ? "Transmitting..." : "Send Message"}</span>
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
