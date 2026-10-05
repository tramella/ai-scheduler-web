"use client";

import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  Copy,
  Check,
  Building2,
  Sparkles,
  LifeBuoy,
  Bug,
} from "lucide-react";

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState<"general" | "enterprise" | "feedback" | "bug">("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const inquiryTypes = [
    { id: "general", label: "General", icon: MessageSquare },
    { id: "enterprise", label: "Enterprise / Custom Rules", icon: Building2 },
    { id: "feedback", label: "Feature Suggestion", icon: Sparkles },
    { id: "bug", label: "Report Issue", icon: Bug },
  ];

  const handleCopyEmail = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate lightweight client submission with generated ticket ID
    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setTicketId(`ORB-${randomNum}`);
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setCompany("");
    setSubject("");
    setMessage("");
    setSubmitted(false);
  };

  return (
    <main className="flex-1 py-12 sm:py-20 bg-linear-to-b from-white via-zinc-50/40 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center space-x-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 mb-4 border border-zinc-200/60">
            <LifeBuoy className="h-3.5 w-3.5 text-[#FF5A36]" />
            <span>Support & Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
            Let&apos;s talk about your <span className="text-[#FF5A36]">scheduling</span>
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-zinc-600 max-w-xl mx-auto">
            Have a question about custom roster constraints, enterprise SLA, or general feedback? We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Info */}
          <div className="lg:col-span-5 space-y-5">
            {/* Direct Channel Cards */}
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <h3 className="font-bold text-lg text-zinc-900">Direct Contact</h3>
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Avg response &lt; 2h</span>
                </span>
              </div>

              {/* Email 1 */}
              <div className="group rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:bg-zinc-50 hover:border-zinc-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
                      <Mail className="h-4 w-4 text-[#FF5A36]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        General & Support
                      </p>
                      <a
                        href="mailto:support@orbit-scheduling.com"
                        className="text-sm font-semibold text-zinc-900 hover:text-[#FF5A36] transition-colors"
                      >
                        support@orbit-scheduling.com
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail("support@orbit-scheduling.com")}
                    title="Copy email"
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 transition"
                  >
                    {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Email 2 */}
              <div className="group rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:bg-zinc-50 hover:border-zinc-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
                      <Building2 className="h-4 w-4 text-[#0B0F1A]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Sales & Enterprise
                      </p>
                      <a
                        href="mailto:sales@orbit-scheduling.com"
                        className="text-sm font-semibold text-zinc-900 hover:text-[#FF5A36] transition-colors"
                      >
                        sales@orbit-scheduling.com
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail("sales@orbit-scheduling.com")}
                    title="Copy email"
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Hours and SLA */}
              <div className="space-y-3 pt-2 text-xs text-zinc-500">
                <div className="flex items-center space-x-2.5">
                  <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>Mon – Fri • 09:00 – 18:00 (UTC+7)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>Ho Chi Minh City, Vietnam • Global Remote</span>
                </div>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="rounded-3xl border border-zinc-200/70 bg-linear-to-br from-zinc-50 via-white to-orange-50/30 p-6 text-xs text-zinc-600 leading-relaxed shadow-2xs">
              <div className="flex items-center space-x-2 text-zinc-900 font-bold mb-1.5">
                <Sparkles className="h-4 w-4 text-[#FF5A36]" />
                <span>Custom Roster Integration?</span>
              </div>
              <p>
                Have a proprietary HR / attendance software or complex shift rotation agreements? Contact our team for bespoke API integrations and dedicated LLM fine-tuning.
              </p>
            </div>
          </div>

          {/* Right Main Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="inline-block font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 mb-2">
                      Reference #{ticketId}
                    </span>
                    <h3 className="text-2xl font-bold text-zinc-900">Message Received!</h3>
                  </div>
                  <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-zinc-900">{name}</strong>. Your inquiry has been dispatched to our engineering & product team. We will respond to <strong className="text-zinc-900">{email}</strong> within 1 business day.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition shadow-2xs"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2.5">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {inquiryTypes.map((item) => {
                        const Icon = item.icon;
                        const isSelected = inquiryType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setInquiryType(item.id as any)}
                            className={`flex flex-col items-center text-center p-3 rounded-xl border text-xs font-medium transition-all ${
                              isSelected
                                ? "border-zinc-900 bg-[#0B0F1A] text-white shadow-2xs"
                                : "border-zinc-200 bg-zinc-50/50 text-zinc-600 hover:border-zinc-300 hover:bg-white"
                            }`}
                          >
                            <Icon className={`h-4 w-4 mb-1.5 ${isSelected ? "text-[#FF5A36]" : "text-zinc-400"}`} />
                            <span className="leading-tight">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/40 py-2.5 px-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/40 py-2.5 px-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 transition"
                      />
                    </div>
                  </div>

                  {/* Company & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Company / Organization <span className="text-zinc-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Hospitality"
                        className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/40 py-2.5 px-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Question on multi-branch scheduling"
                        className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/40 py-2.5 px-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question, scheduling constraints, or feedback in detail..."
                      className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/40 p-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-zinc-500">
                      We respect your privacy. No spam.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0B0F1A] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition active:scale-[0.99] border border-zinc-800 group"
                    >
                      <Send className="mr-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
                      <span>{loading ? "Sending..." : "Send Message"}</span>
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
