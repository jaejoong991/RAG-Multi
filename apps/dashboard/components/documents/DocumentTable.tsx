import { FileIcon, MoreVertical, Trash2 } from "lucide-react";

const mockDocs = [
  { id: "1", name: "product-catalog-2024.pdf", type: "PDF", size: "4.2MB", chunks: 142, status: "Indexed", date: "Apr 23, 2024" },
  { id: "2", name: "faq-document.txt", type: "TXT", size: "24KB", chunks: 8, status: "Indexed", date: "Apr 22, 2024" },
  { id: "3", name: "pricing-guide.pdf", type: "PDF", size: "1.8MB", chunks: 0, status: "Processing", date: "Apr 24, 2024" },
  { id: "4", name: "returns-policy.docx", type: "DOCX", size: "156KB", chunks: 0, status: "Failed", date: "Apr 24, 2024" },
];

export function DocumentTable() {
  return (
    <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5">
          <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
            <th className="px-6 py-4">File Name</th>
            <th className="px-6 py-4 text-center">Chunks</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {mockDocs.map((doc) => (
            <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-on-surface-variant">
                    <FileIcon size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{doc.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{doc.size}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-on-surface-variant font-mono">
                {doc.chunks || "—"}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  doc.status === "Indexed" ? "bg-success/10 text-success" :
                  doc.status === "Processing" ? "bg-warning/10 text-warning" :
                  "bg-error/10 text-error"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    doc.status === "Indexed" ? "bg-success" :
                    doc.status === "Processing" ? "bg-warning animate-pulse" :
                    "bg-error"
                  }`} />
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 text-on-surface-variant">
                {doc.date}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                    <Trash2 size={16} className="text-error/70 hover:text-error" />
                  </button>
                  <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                    <MoreVertical size={16} className="text-on-surface-variant" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
