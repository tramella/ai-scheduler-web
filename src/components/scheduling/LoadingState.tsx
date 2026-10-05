import React from "react";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

export const LoadingState: React.FC = () => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-xs">
      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md">
        <Sparkles className="h-8 w-8 animate-pulse text-zinc-100" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">
        Generating Optimized Schedule
      </h3>
      <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8">
        ORBIT is analyzing your employee roster, verifying availability constraints, and calculating the optimal shift matrix.
      </p>

      {/* Progress steps visualization */}
      <div className="max-w-md mx-auto space-y-3 text-left">
        <div className="flex items-center space-x-3 rounded-lg bg-zinc-50 p-3 border border-zinc-100 text-xs font-medium text-zinc-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Parsing Excel records & employee skills</span>
        </div>
        <div className="flex items-center space-x-3 rounded-lg bg-zinc-50 p-3 border border-zinc-100 text-xs font-medium text-zinc-700">
          <Clock className="h-4 w-4 text-zinc-600 animate-spin shrink-0" />
          <span>Evaluating availability, max hours & break requirements</span>
        </div>
        <div className="flex items-center space-x-3 rounded-lg bg-zinc-50/50 p-3 border border-zinc-100 text-xs font-medium text-zinc-400">
          <div className="h-4 w-4 rounded-full border border-zinc-300 shrink-0"></div>
          <span>Validating against deterministic business rules</span>
        </div>
      </div>
    </div>
  );
};
