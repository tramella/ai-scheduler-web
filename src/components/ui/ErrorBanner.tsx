import React, { useState } from "react";
import { AlertCircle, RefreshCw, X, ChevronDown, ChevronUp, Cpu } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);
  if (!message) return null;

  const isModelCapacityError =
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("demand") ||
    message.includes("models failed") ||
    message.includes("quota") ||
    message.includes("429");

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-sm text-rose-900 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 border border-rose-200">
            {isModelCapacityError ? <Cpu className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div className="space-y-1">
            <p className="font-bold text-base text-rose-950">
              {isModelCapacityError
                ? "AI Service Capacity Limit Reached"
                : "Unable to Generate Schedule"}
            </p>
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
              {isModelCapacityError
                ? "All Gemini AI models are currently experiencing temporary high demand or quota limits. All automatic model fallbacks were attempted."
                : message}
            </p>

            {isModelCapacityError && (
              <ul className="mt-2 space-y-1 text-xs text-rose-700 list-disc list-inside">
                <li>Wait 10–30 seconds and click <strong>Retry Generation</strong>.</li>
                <li>Or switch to a shorter date horizon / simplified prompt.</li>
              </ul>
            )}

            {/* Technical diagnostic details toggle */}
            {isModelCapacityError && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center text-xs font-semibold text-rose-900 hover:underline gap-1"
                >
                  <span>{showDetails ? "Hide technical diagnostic" : "Show technical diagnostic"}</span>
                  {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {showDetails && (
                  <div className="mt-2 rounded-lg bg-rose-950/10 p-2.5 font-mono text-[11px] text-rose-900 break-all border border-rose-200/60 max-h-32 overflow-y-auto">
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-rose-400 hover:text-rose-700 transition p-1.5 rounded-lg hover:bg-rose-100"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Action Retry Row */}
      {onRetry && (
        <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-xl bg-rose-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-950 transition active:scale-[0.99] gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Generation Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
