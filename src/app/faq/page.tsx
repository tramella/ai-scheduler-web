"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  Search,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "ai" | "excel" | "security" | "pricing";
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: "all", label: "All Questions", icon: Layers },
    { id: "ai", label: "AI & Accuracy", icon: Cpu },
    { id: "excel", label: "Excel & Formats", icon: FileSpreadsheet },
    { id: "security", label: "Security & Privacy", icon: ShieldCheck },
    { id: "pricing", label: "Pricing & Limits", icon: Sparkles },
  ];

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      category: "ai",
      categoryLabel: "AI Architecture",
      question: "How does ORBIT generate schedules without mathematical mistakes?",
      answer:
        "ORBIT uses a two-tier hybrid architecture: Generative AI (Google Gemini / OpenAI) interprets your natural-language rules, employee preferences, and operational objectives to synthesize an initial roster matrix. Then, our deterministic Node.js constraint engine mathematically audits every single assignment to guarantee zero overlapping shifts, valid rest periods, and strict compliance before delivering the final roster.",
      highlight: "AI proposes, Code decides",
    },
    {
      id: "faq-2",
      category: "excel",
      categoryLabel: "Spreadsheet Input",
      question: "What format does my employee Excel file need to be in?",
      answer:
        "ORBIT accepts standard .xlsx and .xls files under 2 MB. Your spreadsheet should contain basic columns such as Employee Identifier (ID / Mã NV), Full Name, Skills or Roles (e.g. Cashier, Barista, Kitchen), Available Days, and Max Weekly Hours. If you don't have a file ready, you can test with our built-in sample roster directly on the Product page with a single click.",
      highlight: ".xlsx / .xls up to 2MB supported",
    },
    {
      id: "faq-3",
      category: "ai",
      categoryLabel: "Reliability",
      question: "Does the AI ever hallucinate or assign non-existent employees?",
      answer:
        "No. In traditional LLM wrappers, hallucinated names are common. ORBIT solves this by feeding structured schema manifests to the validator. If the AI model proposes an ID or name not present in your uploaded roster dataset, the backend pipeline immediately rejects and corrects the assignment, ensuring 100% data integrity.",
      highlight: "Strict zero-hallucination validation",
    },
    {
      id: "faq-4",
      category: "ai",
      categoryLabel: "Constraint Rules",
      question: "Can an employee be double-booked or scheduled back-to-back without rest?",
      answer:
        "Never. Our deterministic validator enforces hard constraints: max 1 shift per day per employee, mandatory minimum rest intervals between evening and morning shifts, and respect for skill requirements across designated shift stations.",
      highlight: "Hard constraint mathematical enforcement",
    },
    {
      id: "faq-5",
      category: "excel",
      categoryLabel: "Export",
      question: "Can I export the completed roster back to Excel?",
      answer:
        "Yes! Once ORBIT completes generation, click 'Export Excel (.xlsx)' to download a clean, professionally formatted spreadsheet with dates, locations, shift blocks, and employee assignments ready to print, share on Slack, or email to your staff.",
      highlight: "Instant one-click XLSX download",
    },
    {
      id: "faq-6",
      category: "security",
      categoryLabel: "Data Protection",
      question: "Is employee personal data stored or used to train public AI models?",
      answer:
        "No. We enforce a strict 'Token Diet' data minimization standard. PII such as phone numbers, avatar pictures, and email addresses are automatically stripped before sending prompts to the AI provider. Roster computations are ephemeral and never used to train public AI models.",
      highlight: "Zero model training on customer data",
    },
    {
      id: "faq-7",
      category: "pricing",
      categoryLabel: "Free Tier",
      question: "Is ORBIT really free to try?",
      answer:
        "Yes! The Community Plan allows you to try our AI scheduling copilot completely free without requiring a credit card. You can upload rosters, specify natural-language constraints, preview shift matrices, and export spreadsheets immediately.",
      highlight: "No credit card required for Community trial",
    },
    {
      id: "faq-8",
      category: "ai",
      categoryLabel: "Custom Rules",
      question: "Can I write complex labor rules in natural English or Vietnamese?",
      answer:
        "Yes. You can describe nuanced rules like 'Ensure at least 1 Senior Supervisor is on duty during Sunday evenings', 'Limit part-time staff to max 20 hours/week', or 'Prioritize morning shifts for cashiers with opening skill'. The AI naturally parses and translates these into exact constraint variables.",
      highlight: "Multi-language natural language parsing",
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex-1 py-12 sm:py-20 bg-linear-to-b from-white via-zinc-50/40 to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 mb-4 border border-zinc-200/60">
            <HelpCircle className="h-3.5 w-3.5 text-[#FF5A36]" />
            <span>Knowledge Base & FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
            Everything you need to know about <span className="text-[#FF5A36]">ORBIT</span>
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
            Clear answers about our hybrid AI scheduling engine, mathematical verification, Excel compatibility, and privacy guarantees.
          </p>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="space-y-4 mb-10">
          {/* Search Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. 'Excel format', 'validation', 'privacy', 'pricing')..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs focus:border-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-medium text-zinc-400 hover:text-zinc-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`inline-flex items-center space-x-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0B0F1A] text-white shadow-xs"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#FF5A36]" : "text-zinc-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-medium text-zinc-500">
            Showing <strong className="text-zinc-800">{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? "question" : "questions"}
          </span>
          {searchQuery && (
            <span className="text-xs text-zinc-400">
              Filtered by &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>

        {/* Accordion FAQ List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border bg-white overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? "border-zinc-300 shadow-sm ring-1 ring-zinc-200/50"
                      : "border-zinc-200/80 shadow-2xs hover:border-zinc-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-zinc-50/40 transition-colors focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 border border-zinc-200/60">
                          {faq.categoryLabel}
                        </span>
                        {faq.highlight && (
                          <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-medium text-[#FF5A36]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{faq.highlight}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-zinc-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-all duration-200 ${
                        isOpen ? "rotate-180 bg-[#0B0F1A] text-[#FF5A36]" : "group-hover:bg-zinc-200"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/30 space-y-3">
                      <p>{faq.answer}</p>
                      {faq.highlight && (
                        <div className="sm:hidden pt-1">
                          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{faq.highlight}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-zinc-400 mb-3" />
            <h4 className="text-base font-semibold text-zinc-900">No questions found</h4>
            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try searching for something else or reset your filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 inline-flex items-center rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Still have questions banner */}
        <div className="mt-14 rounded-3xl border border-zinc-200/90 bg-linear-to-br from-white via-zinc-50 to-orange-50/30 p-8 sm:p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B0F1A] text-white shadow-xs mb-4">
            <MessageSquare className="h-5 w-5 text-[#FF5A36]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
            Still have questions about your roster setup?
          </h3>
          <p className="text-sm text-zinc-600 max-w-md mx-auto mb-6 leading-relaxed">
            Our scheduling specialists can assist with custom shift configurations, complex union rules, or dedicated enterprise deployments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[#0B0F1A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition active:scale-[0.99] border border-zinc-800 group shadow-xs"
            >
              <span>Get in Touch</span>
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF5A36] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition"
            >
              Test Free Copilot
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
