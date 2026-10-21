"use client";

import React from "react";
import { PageOrganizeItem } from "@/types";
import { RotateCw, RotateCcw, Trash2, Undo2 } from "lucide-react";

interface OrganizeSettingsProps {
  pages: PageOrganizeItem[];
  onRotatePage: (pageIndex: number, deltaDeg: number) => void;
  onRotateAll: (deltaDeg: number) => void;
  onToggleDelete: (pageIndex: number) => void;
  onReset: () => void;
}

export const OrganizeSettings: React.FC<OrganizeSettingsProps> = ({
  pages,
  onRotatePage,
  onRotateAll,
  onToggleDelete,
  onReset,
}) => {
  const activeCount = pages.filter((p) => !p.deleted).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Global Page Actions
        </label>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onRotateAll(90)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-surface-border text-xs font-bold text-slate-200 transition-all"
        >
          <RotateCw className="w-4 h-4 text-indigo-400" />
          <span>Rotate All +90°</span>
        </button>
        <button
          type="button"
          onClick={() => onRotateAll(-90)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-surface-border text-xs font-bold text-slate-200 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-indigo-400" />
          <span>Rotate All -90°</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
        <div className="text-xs font-semibold text-white mb-1">
          Active Pages: {activeCount} of {pages.length}
        </div>
        <div className="text-[11px] text-slate-400">
          Click on the rotate or trash icons on each page in the preview grid on the left to rotate or remove individual pages.
        </div>
      </div>
    </div>
  );
};
