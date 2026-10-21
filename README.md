# PDF Pro Studio — pdf.abishek.in

A modern, high-performance, **100% client-side private PDF suite**. Designed with a full-screen, high-visibility layout and clear, clean, professional controls.

---

## 🚀 Key Features & Tools

### 1. 🗜️ PDF Compressor
- **Intelligent multi-tier compression**: Extreme (smallest file size, scanned doc optimization), Recommended (optimal balance for email & web sharing), Light (preserves high-res photography), and Custom manual controls.
- **Grayscale conversion toggle** (saves up to 40% extra storage).
- **Metadata & XML packet stripping**.
- **Real-time before/after size indicator** with percentage reduction badges.

### 2. 🖼️ Image to PDF
- Supports **JPG, PNG, WebP, GIF, SVG, and BMP**.
- Page size options: **A4**, **US Letter**, or **Fit to Image Dimensions**.
- Orientation modes: **Auto Detect**, **Portrait**, or **Landscape**.
- Configurable margins (**No margin**, **Small 10mm**, **Normal 20mm**).
- Image fit styles (**Fit to page**, **Fill page**, **Original size**).
- Batch combine multiple images into a single multi-page PDF.

### 3. 📄 PDF to Image
- High-fidelity rasterization powered by Mozilla `pdfjs-dist`.
- Resolution presets: **1x (72 DPI)**, **1.5x (108 DPI)**, **2x (144 DPI)**, and **3x (216 DPI Retina)**.
- Formats: **Lossless PNG**, **Compact JPEG**, and **Modern WebP**.
- Page range extraction (all pages or custom ranges e.g. `1-3, 5`).
- Individual page image download + **Download all as ZIP** archive (`jszip`).

### 4. 📝 PDF to DOC (Word & Text)
- Extracts text coordinates, font weights, and spacing per page.
- Smart heading detection and document structure recovery.
- Exports to **Microsoft Word (`.docx`)** via the standard `docx` engine.
- Also supports **Plain Text (`.txt`)** and **Markdown (`.md`)** with interactive preview and 1-click clipboard copy.

### 5. 📑 DOC to PDF
- Converts **Microsoft Word (`.docx`)**, **Markdown (`.md`)**, and **Plain Text (`.txt`)** into formatted PDFs via `mammoth` and `jspdf`.
- Configurable font sizes, page margins, document headers, and centered page numbers.

### 6. 🔗 Additional Professional PDF Tools
- **Merge PDF**: Reorder, sequence, and combine multiple PDFs.
- **Split PDF**: Split into custom page ranges or save every page as separate files in a ZIP.
- **Organize & Rotate**: Visual page grid with 90°/180° rotation per page or all pages, and page deletion.
- **Watermark PDF**: Add custom text or repeating diagonal security grid with opacity, angle, and position controls.
- **Protect & Unlock PDF**: In-browser AES-256 encryption with password protection and instant decryption.

---

## 🔒 100% Client-Side Privacy

- **Zero Cloud Uploads**: All file processing happens inside the user's browser memory using WebAssembly and HTML5 Canvas.
- **No File Size Limits**: Bypasses cloud upload timeouts and limits.
- **AdSense Ready**: Fully configured `ads.txt` and Google AdSense tag integration.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack ready)
- **UI & Styling**: React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Core Engines**:
  - `pdf-lib` (PDF creation, compression, merging, splitting, watermarking)
  - `pdfjs-dist` (High-res page rendering, text extraction)
  - `docx` (Word document generation)
  - `mammoth` (Word .docx extraction)
  - `jspdf` (Paginated document generation)
  - `jszip` (Batch packaging and zip downloads)

---

## 💻 Development & Deployment

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Build production bundle
pnpm build

# Start production server
pnpm start
```
