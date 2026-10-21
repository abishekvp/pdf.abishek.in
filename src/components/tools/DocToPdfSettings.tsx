"use client";

import React from "react";
import { DocToPdfOptions } from "@/types";

interface DocToPdfSettingsProps {
  options: DocToPdfOptions;
  onChange: (options: DocToPdfOptions) => void;
}

export const DocToPdfSettings: React.FC<DocToPdfSettingsProps> = ({
  options,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Size & Orientation */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Page Size
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "a4", label: "A4" },
              { id: "letter", label: "Letter" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ ...options, pageSize: item.id as any })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  options.pageSize === item.id
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                    : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Orientation
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "portrait", label: "Portrait" },
              { id: "landscape", label: "Landscape" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ ...options, orientation: item.id as any })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  options.orientation === item.id
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                    : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font Size & Margins */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Body Font Size</span>
            <span className="text-emerald-400 font-mono">{options.fontSize} pt</span>
          </div>
          <input
            type="range"
            min="9"
            max="16"
            step="1"
            value={options.fontSize}
            onChange={(e) =>
              onChange({ ...options, fontSize: parseInt(e.target.value, 10) })
            }
            className="w-full cursor-pointer accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Page Margins</span>
            <span className="text-emerald-400 font-mono">{options.margin} pt</span>
          </div>
          <input
            type="range"
            min="20"
            max="60"
            step="5"
            value={options.margin}
            onChange={(e) =>
              onChange({ ...options, margin: parseInt(e.target.value, 10) })
            }
            className="w-full cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Headers & Footers */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Layout Elements
        </label>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Document Header</div>
            <div className="text-[11px] text-slate-400">
              Prints document title and separator line at the top
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({ ...options, includeHeader: !options.includeHeader })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              options.includeHeader ? "bg-emerald-500" : "bg-surface-subtle"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                options.includeHeader ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-border/50">
          <div>
            <div className="text-xs font-semibold text-white">Page Numbering</div>
            <div className="text-[11px] text-slate-400">
              Prints centered "Page X" footer on every page
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...options,
                includePageNumbers: !options.includePageNumbers,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              options.includePageNumbers ? "bg-emerald-500" : "bg-surface-subtle"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                options.includePageNumbers ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
