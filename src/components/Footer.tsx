"use client";

import React from "react";
import { FileText, ShieldCheck, Heart, Sparkles, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-border bg-surface-base/80 mt-auto">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                PDF<span className="text-rose-500">Pro</span> Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier client-side PDF workspace. Compress, convert, merge, split, and edit documents with total confidentiality. No files ever leave your device.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero server logging • 100% Client-Side Memory</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Core PDF Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">PDF Compressor</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Image to PDF</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">PDF to Image (PNG/JPG)</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">PDF to Word (.docx)</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">DOC to PDF</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Merge & Split PDF</span>
              </li>
            </ul>
          </div>

          {/* Abishek.in Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Abishek Network
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://image.abishek.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <span>image.abishek.in (Image Studio)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://apps.abishek.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <span>apps.abishek.in (Web Apps)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://abishek.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <span>abishek.in (Home)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-surface-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} pdf.abishek.in. All rights reserved.</div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with precision for private document workflows</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
