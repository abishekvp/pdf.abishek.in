"use client";

import React, { useState } from "react";
import { Lock, Unlock, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface ProtectSettingsProps {
  isUnlockMode?: boolean;
  password: string;
  onPasswordChange: (password: string) => void;
}

export const ProtectSettings: React.FC<ProtectSettingsProps> = ({
  isUnlockMode = false,
  password,
  onPasswordChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isUnlockMode ? "bg-lime-500/20 text-lime-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {isUnlockMode ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {isUnlockMode ? "Unlock Protected Document" : "Set Document Password"}
            </div>
            <div className="text-[11px] text-slate-400">
              {isUnlockMode
                ? "Provide current document password to remove security encryption"
                : "Standard AES-encrypted password prevents unauthorized viewing"}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            {isUnlockMode ? "Current Password" : "New Secure Password"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-subtle border border-surface-border text-sm text-white focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {!isUnlockMode && (
        <div className="flex items-start gap-2 text-xs text-slate-400 bg-surface-subtle/40 p-3 rounded-xl border border-surface-border/50">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Document encryption is handled 100% in your browser. Passwords are never sent or stored anywhere.
          </span>
        </div>
      )}
    </div>
  );
};
