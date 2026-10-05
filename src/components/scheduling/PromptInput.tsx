import React from "react";
import { MessageSquareText } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  const presets = [
    "Assign employees based on skills and balance shift workload.",
    "Prioritize morning shifts for cashiers with max 35 hours/week limit.",
    "Ensure at least 2 staff members per shift and respect all unavailability dates.",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="schedule-prompt"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700"
        >
          Scheduling Directives & Rules
        </label>
        <span className="text-xs text-zinc-400">Natural language instructions</span>
      </div>

      <div className="relative">
        <textarea
          id="schedule-prompt"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Create a weekly schedule. Make sure employees are assigned only during their available hours and do not exceed their maximum working hours."
          className="block w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-2xs focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 leading-relaxed transition"
        />
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-medium text-zinc-400 mr-1">Presets:</span>
        {presets.map((preset, pIdx) => (
          <button
            key={pIdx}
            type="button"
            onClick={() => onChange(preset)}
            className="rounded-lg bg-zinc-100/80 hover:bg-zinc-200/80 border border-zinc-200/60 px-2.5 py-1 text-[11px] font-medium text-zinc-700 transition"
          >
            {preset.slice(0, 38)}...
          </button>
        ))}
      </div>
    </div>
  );
};
