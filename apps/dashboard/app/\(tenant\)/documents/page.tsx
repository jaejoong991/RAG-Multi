import { UploadDropzone } from "@/components/documents/UploadDropzone";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { Plus } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Knowledge Base</h1>
          <p className="text-on-surface-variant mt-2">
            Manage and index your documents for the RAG engine.
          </p>
        </div>
        <button className="primary-gradient text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20">
          <Plus size={18} />
          Upload Documents
        </button>
      </div>

      <UploadDropzone />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Stored Documents
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">34 documents · 12,450 chunks indexed</span>
          </div>
        </div>
        <DocumentTable />
      </div>
    </div>
  );
}
