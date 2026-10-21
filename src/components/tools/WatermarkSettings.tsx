"use client";

import React from "react";
import { WatermarkOptions } from "@/types";

interface WatermarkSettingsProps {
  options: WatermarkOptions;
  onChange: (options: WatermarkOptions) => void;
}

export const WatermarkSettings: React.FC<WatermarkSettingsProps> = ({
  options,
  onChange,
}) => {
  const colorPresets = ["#ef4444", "#64748b", "#3b82f6", "#10b981", "#f59e0b", "#000000"];

  return (
    <div className="space-y-6">
      {/* Watermark text */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Watermark Text
        </label>
        <input
          type="text"
          value={options.text}
          onChange={(e) => onChange({ ...options, text: e.target.value })}
          placeholder="e.g. CONFIDENTIAL, DRAFT, COPY"
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-white focus:outline-none focus:border-teal-500 font-semibold"
        />
      </div>

      {/* Position */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Stamp Position
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "center", label: "Center" },
            { id: "tile", label: "Repeated Grid" },
            { id: "top-left", label: "Top Left" },
            { id: "top-right", label: "Top Right" },
            { id: "bottom-left", label: "Bottom Left" },
            { id: "bottom-right", label: "Bottom Right" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...options, position: item.id as any })}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                options.position === item.id
                  ? "bg-teal-500/20 border-teal-500 text-teal-300"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders: Font size, Opacity, Rotation */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Font Size</span>
            <span className="text-teal-400 font-mono">{options.fontSize} pt</span>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            step="2"
            value={options.fontSize}
            onChange={(e) =>
              onChange({ ...options, fontSize: parseInt(e.target.value, 10) })
            }
            className="w-full cursor-pointer accent-teal-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Opacity</span>
            <span className="text-teal-400 font-mono">
              {Math.round(options.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.9"
            step="0.05"
            value={options.opacity}
            onChange={(e) =>
              onChange({ ...options, opacity: parseFloat(e.target.value) })
            }
            className="w-full cursor-pointer accent-teal-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Rotation Angle</span>
            <span className="text-teal-400 font-mono">{options.rotation}°</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-1">
            {[-45, 0, 45, 90].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => onChange({ ...options, rotation: deg })}
                className={`py-1.5 rounded-lg text-xs font-semibold border ${
                  options.rotation === deg
                    ? "bg-teal-500/20 border-teal-500 text-teal-300"
                    : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        {/* Color presets */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">Color</span>
          <div className="flex items-center gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ ...options, color })}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                  options.color === color
                    ? "scale-110 border-white shadow-lg"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
