"use client";

import React from "react";
import {
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
} from "lucide-react";
import { ToolId } from "@/types";
import { TOOLS } from "@/lib/toolRegistry";

interface ToolSwitcherBarProps {
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

export const ToolSwitcherBar: React.FC<ToolSwitcherBarProps> = ({
  activeTool,
  onSelectTool,
}) => {
  return (
    <div className="w-full bg-surface-card/60 border-b border-surface-border backdrop-blur-sm sticky top-18 z-30 overflow-x-auto no-scrollbar py-2 px-4 sm:px-6">
      <div className="w-full max-w-[1800px] mx-auto flex items-center gap-1.5 sm:gap-2">
        {TOOLS.map((tool) => {
          const IconComponent = ICON_MAP[tool.icon] || FileText;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-white/20 font-bold"
                  : "bg-surface-subtle/70 hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border/60"
              }`}
            >
              <IconComponent
                className="w-4 h-4"
                style={{ color: isActive ? "#ffffff" : tool.color }}
              />
              <span>{tool.name}</span>
              {tool.badge && !isActive && (
                <span className="hidden xl:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/20">
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
