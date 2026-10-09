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
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "ai" | "excel" | "security" | "pricing";
  categoryLabel: string;
  question: string;
  answer: string;
}

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

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      category: "ai",
      categoryLabel: "AI & Rules",
      question: "How does ORBIT ensure zero mathematical mistakes?",
      answer:
        "ORBIT uses a two-tier hybrid architecture: AI interprets your natural-language shift rules, while a deterministic Node.js constraint engine audits every assignment to ensure zero overlapping shifts and full rule compliance.",
    },
    {
      id: "faq-2",
      category: "excel",
      categoryLabel: "Excel & Formats",
      question: "What format does my employee Excel file need to be in?",
      answer:
        "ORBIT accepts standard .xlsx and .xls files under 2 MB with basic columns: Employee ID, Name, Roles/Skills, Availability, and Max Weekly Hours. Built-in sample data is also available with one click.",
    },
    {
      id: "faq-3",
      category: "ai",
      categoryLabel: "AI & Rules",
      question: "Does the AI hallucinate staff or double-book shifts?",
      answer:
        "Never. Our deterministic validator enforces hard constraints: maximum 1 shift per day per employee, mandatory rest intervals between shifts, and strict verification against your uploaded roster IDs.",
    },
    {
      id: "faq-4",
      category: "excel",
      categoryLabel: "Excel & Formats",
      question: "Can I export the schedule back to Excel?",
      answer:
        "Yes. You can export a color-coded, formatted .xlsx spreadsheet with dates, shift blocks, and staff assignments ready for printing or sharing.",
    },
    {
      id: "faq-5",
      category: "security",
      categoryLabel: "Privacy & Security",
      question: "Is employee personal data used to train AI models?",
      answer:
        "No. We enforce data minimization. Sensitive PII is stripped prior to processing, and roster computations are ephemeral and never used to train public AI models.",
    },
    {
      id: "faq-6",
      category: "pricing",
      categoryLabel: "Plans & Access",
      question: "Is ORBIT free to try?",
      answer:
        "Yes. The Community tier lets you test our AI scheduling copilot for free without a credit card. You can upload rosters, test shift constraints, and export schedules immediately.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] py-12 sm:py-20 bg-slate-50/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2.5">
          <div className="inline-flex items-center space-x-2 rounded-full bg-slate-900/[0.05] px-3.5 py-1 text-xs font-semibold text-slate-800">
            <HelpCircle className="h-3.5 w-3.5 text-[#FF7A59]" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#2F2C59]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Answers about AI accuracy, Excel support, and constraint rules.
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
              placeholder="Search questions..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-[#2F2C59] focus:outline-hidden focus:ring-2 focus:ring-[#2F2C59]/10 transition"
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
                  className={`inline-flex items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2F2C59] text-white shadow-xs font-semibold"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
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
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs"
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
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-transform ${
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
        <div className="mt-12 rounded-3xl border border-slate-200/90 bg-white p-7 text-center shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Have custom requirements?
          </h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            Our team can help with custom shift rules or enterprise deployments.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[#2F2C59] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E1B3A] transition border border-[#2F2C59] shadow-xs"
            >
              <span>Contact Us</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
