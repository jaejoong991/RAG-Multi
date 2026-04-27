"use client";

import { UploadCloud } from "lucide-react";

export function UploadDropzone() {
  return (
    <div className="border-2 border-dashed border-white/10 rounded-2xl bg-white/2 p-12 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <UploadCloud size={24} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Drag & drop files here, or click to browse</p>
        <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest">
          Supports PDF, TXT, DOCX, CSV — Max 50MB per file
        </p>
      </div>
    </div>
  );
}
