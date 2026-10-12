"use client";

import React from "react";
import {
  X,
  User,
  Mail,
  Building2,
  ShieldCheck,
  Calendar,
  LogOut,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { user, companies, activeCompany, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    onClose();
    logout();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-[#2F2C59] dark:text-indigo-400" />
            <h2 id="profile-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              Account Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Avatar Banner */}
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="h-14 w-14 rounded-2xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {user.full_name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {user.account_type}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Email Verified & Active</span>
              </div>
            </div>
          </div>

          {/* User Information Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Personal Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-slate-400 dark:text-slate-500 flex items-center space-x-1.5 mb-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Work Email</span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.email}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-slate-400 dark:text-slate-500 flex items-center space-x-1.5 mb-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Phone Number</span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {user.phone_number || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Associated Companies & Workspaces */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Workspaces & Permissions ({companies.length})
            </h4>

            {companies.length > 0 ? (
              <div className="space-y-2">
                {companies.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition ${
                      c.id === activeCompany?.id
                        ? "bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2F2C59] dark:text-indigo-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                          <span>{c.name}</span>
                          {c.id === activeCompany?.id && (
                            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.2 rounded-md">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Code: {c.code}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        {c.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Personal account mode (no company joined yet).
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
