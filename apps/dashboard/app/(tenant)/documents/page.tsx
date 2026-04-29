"use client";

import { useEffect, useRef, useState } from "react";
import { FileIcon, MoreVertical, Plus, Trash2 } from "lucide-react";
import { UploadDropzone } from "@/components/documents/UploadDropzone";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { apiDelete, apiGet, apiPost } from "@/lib/api";

type DocStatus = "UPLOADING" | "PROCESSING" | "INDEXED" | "FAILED";

interface DocumentDto {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: DocStatus;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsResponse {
  success: boolean;
  data: DocumentDto[];
  meta: { total: number; page: number; limit: number };
}

const STATUS_STYLES: Record<DocStatus, { badge: string; dot: string }> = {
  INDEXED: { badge: "bg-success/10 text-success", dot: "bg-success" },
  PROCESSING: { badge: "bg-warning/10 text-warning", dot: "bg-warning animate-pulse" },
  UPLOADING: { badge: "bg-primary/10 text-primary", dot: "bg-primary animate-pulse" },
  FAILED: { badge: "bg-error/10 text-error", dot: "bg-error" },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchDocuments() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiGet<DocumentsResponse>("/api/v1/documents");
      setDocuments(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchDocuments();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on("state_changed", undefined, reject, resolve);
      });

      const url = `gs://${storageRef.bucket}/${storageRef.fullPath}`;

      await apiPost("/api/v1/documents", {
        name: file.name,
        type: file.type,
        size: file.size,
        url,
      });

      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiDelete(`/api/v1/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Knowledge Base</h1>
          <p className="text-on-surface-variant mt-2">
            Manage and index your documents for the RAG engine.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="primary-gradient text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          {isUploading ? "Uploading..." : "Upload Documents"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
        <UploadDropzone />
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 text-error text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Stored Documents
          </h3>
          <span className="text-xs text-on-surface-variant">
            {documents.length} documents
          </span>
        </div>

        {isLoading ? (
          <div className="bg-surface-card border border-white/5 rounded-xl p-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      No documents uploaded yet.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => {
                    const styles = STATUS_STYLES[doc.status];
                    return (
                      <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-on-surface-variant">
                              <FileIcon size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{doc.name}</p>
                              <p className="text-[10px] text-on-surface-variant">{formatBytes(doc.size)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => void handleDelete(doc.id)}
                              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} className="text-error/70 hover:text-error" />
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-on-surface-variant" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
