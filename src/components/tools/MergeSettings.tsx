"use client";

import React from "react";
import { UploadedFileItem } from "@/types";
import { ArrowUp, ArrowDown, Trash2, FileText, Plus } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface MergeSettingsProps {
  files: UploadedFileItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
  onAddMore: () => void;
}

export const MergeSettings: React.FC<MergeSettingsProps> = ({
  files,
  onReorder,
  onRemove,
  onAddMore,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          PDF Sequence ({files.length} files)
        </label>
        <button
          type="button"
          onClick={onAddMore}
          className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add More PDFs</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {files.map((file, idx) => (
          <div
            key={file.id}
            className="p-3 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-surface-subtle text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate max-w-[200px]">
                  {file.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {formatBytes(file.size)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => onReorder(idx, idx - 1)}
                className="p-1.5 rounded-lg hover:bg-surface-subtle text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === files.length - 1}
                onClick={() => onReorder(idx, idx + 1)}
                className="p-1.5 rounded-lg hover:bg-surface-subtle text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
