"use client";

import React from "react";
import { SplitOptions } from "@/types";
import { Split, Archive } from "lucide-react";

interface SplitSettingsProps {
  options: SplitOptions;
  onChange: (options: SplitOptions) => void;
  pageCount?: number;
}

export const SplitSettings: React.FC<SplitSettingsProps> = ({
  options,
  onChange,
  pageCount = 1,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Split Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...options, mode: "range" })}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              options.mode === "range"
                ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-md"
                : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Split className="w-4 h-4 text-pink-400" />
              <span>Extract Range</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Extract specific pages into a single PDF
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...options, mode: "every" })}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              options.mode === "every"
                ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-md"
                : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Archive className="w-4 h-4 text-pink-400" />
              <span>Split Every Page</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Save all pages as separate PDFs in a ZIP
            </div>
          </button>
        </div>
      </div>

      {options.mode === "range" && (
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-2 animate-in fade-in duration-150">
          <label className="text-xs font-semibold text-slate-300 block">
            Page Ranges to Extract
          </label>
          <input
            type="text"
            placeholder={`e.g. 1-2, 4 (max ${pageCount})`}
            value={options.ranges}
            onChange={(e) => onChange({ ...options, ranges: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-surface-border text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
          />
          <p className="text-[11px] text-slate-400">
            Specify page numbers and/or ranges separated by commas. E.g. "1-3, 5".
          </p>
        </div>
      )}
    </div>
  );
};
