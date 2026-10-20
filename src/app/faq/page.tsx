"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  ArrowRight,
  Search,
  ShieldCheck,
  FileSpreadsheet,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "ai" | "excel" | "security" | "pricing";
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "ai",
    categoryLabel: "AI & Rules",
    question: "Which AI model powers the scheduling engine?",
    answer:
      "The Free Community tier is powered by Google Gemini AI combined with our deterministic constraint engine. Upgrading to the Pro tier unlocks the ability to use and switch to OpenAI (GPT-4o).",
  },
  {
    id: "faq-2",
    category: "pricing",
    categoryLabel: "Plans & Access",
    question: "How does the Free Trial work?",
    answer:
      "You can generate 1 free schedule trial using Google Gemini without providing a credit card. To run unlimited schedules, unlock multi-location support, and access OpenAI, you can upgrade to the Pro plan.",
  },
  {
    id: "faq-3",
    category: "ai",
    categoryLabel: "AI & Rules",
    question: "How does ORBIT ensure zero double-booking or rule mistakes?",
    answer:
      "AI interprets your natural-language shift rules, and our deterministic constraint engine audits every single shift assignment mathematically to guarantee zero overlapping hours and 100% compliance.",
  },
  {
    id: "faq-4",
    category: "excel",
    categoryLabel: "Excel & Formats",
    question: "What format does my employee Excel file need to be in?",
    answer:
      "ORBIT accepts standard .xlsx and .xls files under 2 MB with basic columns: Employee ID, Name, Roles/Skills, Availability, and Max Weekly Hours. Built-in demo data is also available with one click.",
  },
  {
    id: "faq-5",
    category: "excel",
    categoryLabel: "Excel & Formats",
    question: "Can I export the schedule back to Excel?",
    answer:
      "Yes. You can export a color-coded, print-ready .xlsx spreadsheet with dates, shift blocks, and staff assignments ready for sharing.",
  },
  {
    id: "faq-6",
    category: "security",
    categoryLabel: "Privacy & Security",
    question: "Is employee personal data used to train AI models?",
    answer:
      "No. Sensitive PII is stripped prior to processing, and roster computations are ephemeral and never used to train public AI models.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: "all", label: "All Questions", icon: Layers },
    { id: "ai", label: "AI & Rules", icon: Cpu },
    { id: "excel", label: "Excel & Formats", icon: FileSpreadsheet },
    { id: "security", label: "Privacy & Security", icon: ShieldCheck },
    { id: "pricing", label: "Plans & Access", icon: Sparkles },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] py-12 sm:py-20 bg-slate-50/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
            <HelpCircle className="h-3.5 w-3.5 text-[#2F5BFF]" />
            <span className="tracking-tight">Knowledge Base & FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
            Frequently asked questions.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Everything you need to know about the AI solver, personal plans, and Excel format support.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3.5 mb-8">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-[#2F5BFF] focus:outline-hidden focus:ring-2 focus:ring-[#2F5BFF]/30 transition"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2F2C59] text-white shadow-xs"
                      : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-hidden cursor-pointer"
                >
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 pr-3">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-transform ${
                      isOpen ? "rotate-180 bg-[#2F2C59] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Card */}
        <div className="mt-12 rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Have custom requirements?
          </h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            Our team can help with custom shift rules or enterprise deployments.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#2F2C59] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1E1B3A] transition border border-[#2F2C59] shadow-xs active:scale-95"
            >
              <span>Contact Specialists</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
