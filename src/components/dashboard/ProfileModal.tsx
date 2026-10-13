"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Building2,
  ShieldCheck,
  LogOut,
  Phone,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { StatusChip } from "@/components/ui/StatusChip";
import { ChangePasswordForm } from "./ChangePasswordForm";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { user, companies, activeCompany, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    onClose();
    logout();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-50 text-[#2F2C59] dark:bg-indigo-950/50 dark:text-indigo-300">
              <User className="h-4 w-4" />
            </div>
            <h2 id="profile-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
              Account profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Avatar Banner */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="h-12 w-12 rounded-2xl bg-[#2F2C59] dark:bg-indigo-600 text-white font-semibold text-lg flex items-center justify-center shadow-xs shrink-0">
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.full_name}
                </h3>
                <StatusChip variant="info">
                  {user.account_type}
                </StatusChip>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Email verified & active</span>
              </div>
            </div>
          </div>

          {/* User Information Details */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Personal details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Work email</span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.email}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Phone number</span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {user.phone_number || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Security & password
              </h4>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F5BFF] hover:underline cursor-pointer"
              >
                <KeyRound className="h-3 w-3" />
                <span>{isChangePasswordOpen ? "Cancel" : "Change password"}</span>
              </button>
            </div>

            {isChangePasswordOpen && (
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                <ChangePasswordForm onSuccess={() => setIsChangePasswordOpen(false)} />
              </div>
            )}
          </div>

          {/* Associated Companies & Workspaces */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Workspaces & permissions ({companies.length})
            </h4>

            {companies.length > 0 ? (
              <div className="space-y-2">
                {companies.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs transition ${
                      c.id === activeCompany?.id
                        ? "bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200/70 dark:border-indigo-800/70"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2F2C59] dark:text-indigo-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.id === activeCompany?.id && (
                            <StatusChip variant="info">Active</StatusChip>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Code: {c.code}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusChip variant="neutral">{c.role}</StatusChip>
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
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 px-3.5 py-2 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 px-4 py-2 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
