import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-darkest flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400">
          The requested tool or page does not exist. Return to the PDF Pro Studio workspace to continue.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PDF Studio</span>
        </Link>
      </div>
    </div>
  );
}
