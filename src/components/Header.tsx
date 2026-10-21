"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Grid,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Minimize2,
  Image,
  FileImage,
  FileOutput,
  Combine,
  Split,
  LayoutGrid,
  Stamp,
  Lock,
  Unlock,
} from "lucide-react";
import { ToolId } from "@/types";
import { TOOLS } from "@/lib/toolRegistry";

interface HeaderProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Minimize2,
  Image,
  FileImage,
  FileText,
  FileOutput,
  Combine,
  Split,
  LayoutGrid,
  Stamp,
  Lock,
  Unlock,
};

export const Header: React.FC<HeaderProps> = ({ activeTool, onSelectTool }) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header className="border-b border-surface-border/80 bg-surface-base/95 backdrop-blur-xl sticky top-0 z-40 transition-all shadow-sm">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectTool("compress")}
            className="group flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-[1.5px] shadow-lg shadow-rose-950/50 group-hover:shadow-rose-600/40 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-surface-card rounded-[14px] flex items-center justify-center">
                <FileText className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PDF<span className="text-rose-500">Pro</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-sm shadow-rose-950/30">
                  Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                pdf.abishek.in · 100% Client-Side Private PDF Suite
              </p>
            </div>
          </div>
        </div>

        {/* Center / Navigation Tools Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-card/90 border border-surface-border/80 hover:border-slate-500/70 text-slate-200 text-sm font-semibold transition-all hover:bg-surface-subtle shadow-sm hover:shadow"
          >
            <Grid className="w-4 h-4 text-rose-400" />
            <span>All PDF Tools</span>
            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-surface-subtle text-slate-400 border border-surface-border">
              {TOOLS.length}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                toolsDropdownOpen ? "rotate-180 text-rose-400" : ""
              }`}
            />
          </button>

          {toolsDropdownOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[540px] bg-surface-card/95 backdrop-blur-2xl border border-surface-borderLight/50 rounded-2xl shadow-2xl shadow-black/60 p-4 grid grid-cols-2 gap-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              {TOOLS.map((tool) => {
                const IconComponent = ICON_MAP[tool.icon] || FileText;
                const isCurrent = activeTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      setToolsDropdownOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      isCurrent
                        ? "bg-rose-500/15 border border-rose-500/40 text-white shadow-sm"
                        : "hover:bg-surface-subtle text-slate-300 hover:text-white border border-transparent"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner"
                      style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/25">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{tool.shortDesc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Badges & Ecosystem links */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">100% Client-Side Privacy</span>
            <span className="sm:hidden">Private</span>
          </div>

          <a
            href="https://image.abishek.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-card hover:bg-surface-subtle border border-surface-border/80 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
            title="Open Image Compressor & Converter"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>ImagePro</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
