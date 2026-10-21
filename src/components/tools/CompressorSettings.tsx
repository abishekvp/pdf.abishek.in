"use client";

import React from "react";
import { Sliders, Zap, Award, Sparkles, Check } from "lucide-react";
import { CompressionOptions } from "@/types";

interface CompressorSettingsProps {
  options: CompressionOptions;
  onChange: (options: CompressionOptions) => void;
}

export const CompressorSettings: React.FC<CompressorSettingsProps> = ({
  options,
  onChange,
}) => {
  const presets: {
    id: CompressionOptions["level"];
    title: string;
    desc: string;
    tag: string;
    color: string;
  }[] = [
    {
      id: "recommended",
      title: "Recommended Compression",
      desc: "Optimal balance of clear visual readability and file reduction",
      tag: "Best for sharing & email",
      color: "border-rose-500/80 bg-rose-500/10 text-white",
    },
    {
      id: "extreme",
      title: "Extreme Compression",
      desc: "Maximum reduction with lower DPI. Ideal for scanned documents",
      tag: "Smallest size",
      color: "border-amber-500/80 bg-amber-500/10 text-white",
    },
    {
      id: "light",
      title: "Light Compression",
      desc: "Preserves sharp high-resolution imagery and fine typography",
      tag: "Highest quality",
      color: "border-cyan-500/80 bg-cyan-500/10 text-white",
    },
    {
      id: "custom",
      title: "Custom Controls",
      desc: "Fine-tune target DPI, image quality, and raster settings manually",
      tag: "Advanced",
      color: "border-violet-500/80 bg-violet-500/10 text-white",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Compression Level
        </label>
        <div className="space-y-2.5">
          {presets.map((preset) => {
            const isSelected = options.level === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onChange({ ...options, level: preset.id })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? preset.color + " shadow-lg"
                    : "border-surface-border bg-surface-subtle/40 hover:bg-surface-subtle text-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? "border-rose-400 bg-rose-500 text-white"
                      : "border-slate-500 bg-surface-card"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white">{preset.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-darkest/60 border border-white/10 text-slate-300">
                      {preset.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{preset.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom sliders if custom level selected */}
      {options.level === "custom" && (
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-4 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
              <span>Target Resolution (DPI)</span>
              <span className="text-rose-400 font-mono">{options.dpi} DPI</span>
            </div>
            <input
              type="range"
              min="72"
              max="300"
              step="12"
              value={options.dpi}
              onChange={(e) =>
                onChange({ ...options, dpi: parseInt(e.target.value, 10) })
              }
              className="w-full cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>72 (Web)</span>
              <span>150 (Balanced)</span>
              <span>300 (Print)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
              <span>Image Quality</span>
              <span className="text-rose-400 font-mono">
                {Math.round(options.quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={options.quality}
              onChange={(e) =>
                onChange({ ...options, quality: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Optimization Flags
        </label>

        {/* Color vs Grayscale */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Grayscale Conversion</div>
            <div className="text-[11px] text-slate-400">
              Converts color images to B&W for up to 40% extra savings
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...options,
                colorMode: options.colorMode === "grayscale" ? "color" : "grayscale",
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              options.colorMode === "grayscale" ? "bg-rose-500" : "bg-surface-subtle"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                options.colorMode === "grayscale" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Remove Annotations / Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-border/50">
          <div>
            <div className="text-xs font-semibold text-white">Strip Metadata</div>
            <div className="text-[11px] text-slate-400">
              Removes internal creator tags, XML packets, and thumbnails
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...options,
                removeAnnotations: !options.removeAnnotations,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              options.removeAnnotations ? "bg-rose-500" : "bg-surface-subtle"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                options.removeAnnotations ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
