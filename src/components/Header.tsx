import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Workforce Scheduler</h1>
            <p className="text-xs text-slate-500">Natural-language & Excel-powered intelligent shift planner</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
            Free Community MVP
          </span>
        </div>
      </div>
    </header>
  );
};
