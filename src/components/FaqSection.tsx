"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are my documents, confidential agreements, and photos private?",
      a: "Yes, 100%. Unlike legacy web converters that upload your private documents to unknown cloud servers, pdf.abishek.in processes every single byte locally within your browser. No files, metadata, or images ever leave your device or touch a server.",
    },
    {
      q: "How does the PDF Compressor reduce file size without ruining text clarity?",
      a: "Our compression engine intelligently analyzes embedded raster graphics, downsamples redundant high-DPI imagery, compresses internal PDF object streams, and removes extraneous metadata headers. Text fonts and vector line drawings remain crisp and sharp.",
    },
    {
      q: "Which image formats are supported for Image to PDF conversion?",
      a: "You can convert JPG, JPEG, PNG, WebP, GIF, SVG, and BMP images into standardized PDF documents. You can also reorder pages, adjust margins, and select between A4, US Letter, or exact image dimension fits.",
    },
    {
      q: "How does the PDF to Word (.docx) converter work?",
      a: "The tool extracts semantic text tokens, font weights, and vertical spacing from each page. It reconstructs paragraphs, headings, and document sections into a genuine Microsoft Word (.docx) file that you can immediately open and edit in Word, Google Docs, or LibreOffice.",
    },
    {
      q: "Can I convert Word documents (.docx) and text files into PDF?",
      a: "Yes! The DOC to PDF tool parses Word .docx, markdown (.md), and plain text (.txt) files, applies clean professional typography, margins, headers, and automatic pagination, and produces a print-ready PDF in seconds.",
    },
    {
      q: "Is there any file size limit or fee?",
      a: "Because all processing occurs directly in your computer's RAM, there are no artificial file size limitations, no daily caps, no watermark imprints, and no sign-up or credit card requirements.",
    },
  ];

  return (
    <section className="py-12 border-t border-surface-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-surface-card border border-surface-border overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-100 hover:text-rose-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-rose-400" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-surface-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
