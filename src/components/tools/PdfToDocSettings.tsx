"use client";

import React from "react";
import { PdfToDocOptions } from "@/types";
import { FileText, FileCode, AlignLeft, Sparkles, Check } from "lucide-react";

interface PdfToDocSettingsProps {
  options: PdfToDocOptions;
  onChange: (options: PdfToDocOptions) => void;
}

export const PdfToDocSettings: React.FC<PdfToDocSettingsProps> = ({
  options,
  onChange,
}) => {
  const formats = [
    {
      id: "docx",
      label: "Microsoft Word (.docx)",
      desc: "Fully editable Word document with heading styles, paragraphs, and page breaks",
      icon: FileText,
      badge: "Standard",
    },
    {
      id: "txt",
      label: "Plain Text (.txt)",
      desc: "Clean raw text extracted per page with no binary overhead",
      icon: AlignLeft,
      badge: "Universal",
    },
    {
      id: "md",
      label: "Markdown (.md)",
      desc: "Formatted markdown text ready for GitHub, Notion, or Obsidian",
      icon: FileCode,
      badge: "Developer",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Target Document Format
        </label>
        <div className="space-y-2.5">
          {formats.map((fmt) => {
            const isSelected = options.format === fmt.id;
            const Icon = fmt.icon;
            return (
              <div
                key={fmt.id}
                onClick={() => onChange({ ...options, format: fmt.id as any })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 text-white shadow-lg"
                    : "border-surface-border bg-surface-subtle/40 hover:bg-surface-subtle text-slate-300"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-violet-600 text-white"
                      : "bg-surface-card text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white">{fmt.label}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-darkest/60 border border-white/10 text-slate-300">
                      {fmt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{fmt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extra intelligence options */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Extraction Settings
        </label>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Smart Heading Detection</div>
            <div className="text-[11px] text-slate-400">
              Detects titles and headers from font hierarchy
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...options,
                detectHeadings: !options.detectHeadings,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              options.detectHeadings ? "bg-violet-600" : "bg-surface-subtle"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                options.detectHeadings ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-border/50">
          <div>
            <div className="text-xs font-semibold text-white">Preserve Page Separators</div>
            <div className="text-[11px] text-slate-400">
              Inserts document page breaks between PDF pages
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...options,
                preserveLayout: !options.preserveLayout,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              options.preserveLayout ? "bg-violet-600" : "bg-surface-subtle"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                options.preserveLayout ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
