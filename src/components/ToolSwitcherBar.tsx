"use client";

import React, { useRef, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active button into view on mount or change
  useEffect(() => {
    if (activeButtonRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeButtonRef.current;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;
      const buttonLeft = button.offsetLeft;
      const buttonRight = buttonLeft + button.offsetWidth;

      if (buttonLeft < containerLeft + 30) {
        container.scrollTo({ left: Math.max(0, buttonLeft - 30), behavior: "smooth" });
      } else if (buttonRight > containerRight - 30) {
        container.scrollTo({
          left: buttonRight - container.clientWidth + 30,
          behavior: "smooth",
        });
      }
    }
  }, [activeTool]);

  return (
    <div className="w-full bg-surface-darkest/90 border-b border-surface-border/80 backdrop-blur-xl sticky top-18 sm:top-20 z-30 shadow-md shadow-black/25">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-[1800px] mx-auto flex items-center gap-2 sm:gap-2.5">
          {TOOLS.map((tool) => {
            const IconComponent = ICON_MAP[tool.icon] || FileText;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => onSelectTool(tool.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer select-none ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-bold shadow-lg shadow-rose-950/60 ring-1 ring-white/30 scale-[1.02]"
                    : "bg-surface-card/90 hover:bg-surface-subtle text-slate-300 hover:text-white border border-surface-border/80 hover:border-slate-500/70 shadow-sm hover:shadow hover:-translate-y-0.5 duration-150 font-medium"
                }`}
              >
                <IconComponent
                  className="w-4 h-4 shrink-0 transition-transform"
                  style={{ color: isActive ? "#ffffff" : tool.color }}
                />
                <span>{tool.name}</span>
                {tool.badge && (
                  <span
                    className={`hidden xl:inline text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-rose-500/15 text-rose-300 border-rose-500/25"
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
