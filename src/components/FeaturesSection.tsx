"use client";

import React from "react";
import {
  ShieldCheck,
  Zap,
  Maximize2,
  FileCheck2,
  Lock,
  Layers,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      title: "100% Client-Side Privacy",
      description:
        "Your confidential PDFs and images never leave your computer. Processing runs entirely in browser memory using WebAssembly.",
    },
    {
      icon: Maximize2,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      title: "Full-Screen Visual Studio",
      description:
        "Enjoy spacious, distraction-free visibility with multi-column side-by-side previews, page galleries, and high-clarity sliders.",
    },
    {
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      title: "Instantaneous Conversions",
      description:
        "No waiting in cloud queues or uploading large files across slow connections. Conversions finish instantly at native device speed.",
    },
    {
      icon: FileCheck2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      title: "Lossless Typography & Geometry",
      description:
        "Preserve exact fonts, margins, page geometry, vector outlines, and color profiles without blurriness or distortion.",
    },
    {
      icon: Lock,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
      title: "Military-Grade Security",
      description:
        "Encrypt, password-protect, or watermark sensitive records with industry-standard AES encryption and customizable security stamps.",
    },
    {
      icon: Layers,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      title: "All-in-One Utility Suite",
      description:
        "Compress, merge, split, rotate, convert to Word, extract to high-res images, and create PDFs from photos in one unified dashboard.",
    },
  ];

  return (
    <section className="py-12 border-t border-surface-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Engineered for Professional Document Workflows
        </h2>
        <p className="text-sm text-slate-400">
          Built with cutting-edge WebAssembly, HTML5 Canvas, and modern cryptographic primitives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-surface-card border border-surface-border hover:border-slate-600 transition-all shadow-lg"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 ${feat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
