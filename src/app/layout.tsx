import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070A10",
};

export const metadata: Metadata = {
  title: "PDF Pro Studio — 100% Client-Side PDF Compressor, Converter, & Tools",
  description:
    "Professional, secure, and private PDF studio. Compress PDF, Image to PDF, PDF to Image, PDF to Word (.docx), DOC to PDF, Merge, Split, and Organize PDFs directly in your browser with zero server uploads.",
  keywords: [
    "pdf compressor",
    "image to pdf",
    "pdf to image",
    "pdf to docx",
    "pdf to word",
    "doc to pdf",
    "word to pdf",
    "merge pdf",
    "split pdf",
    "organize pdf",
    "watermark pdf",
    "protect pdf",
    "client-side pdf tools",
    "free pdf editor",
    "reduce pdf file size",
  ],
  authors: [{ name: "abishek.in" }],
  openGraph: {
    title: "PDF Pro Studio — 100% Client-Side PDF Compressor & Converter",
    description:
      "Compress, convert, merge, split, and edit PDFs with 100% in-browser privacy. Fast, secure, and full-screen visibility.",
    url: "https://pdf.abishek.in",
    siteName: "PDF Pro Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3706001002085899"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-surface-darkest text-slate-100 min-h-screen antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
