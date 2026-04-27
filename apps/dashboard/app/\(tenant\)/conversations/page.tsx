"use client";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { Search, Filter, Download, Trash2, Calendar, Clock } from "lucide-react";

const conversations = [
  { id: "sess_a8f2...3d1e", preview: "What is your return policy for international...", count: 12, time: "2 hours ago", active: true },
  { id: "sess_92b1...f4e2", preview: "How do I configure the API keys for...", count: 4, time: "5 hours ago", active: false },
  { id: "sess_11c4...a90d", preview: "Explain the difference between vector...", count: 8, time: "Yesterday", active: false },
  { id: "sess_k93j...v2l1", preview: "Troubleshooting indexing errors on large...", count: 24, time: "Oct 24", active: false },
];

const mockThread = [
  { role: "user", content: "What is your return policy for international orders?" },
  { 
    role: "assistant", 
    content: "International orders can be returned within 30 days of delivery. Please note that return shipping costs and any original customs duties are non-refundable. All items must be in original condition with tags attached.",
    sources: [{ name: "return-policy.pdf", page: 12, score: 98 }]
  },
  { role: "user", content: "Is there a specific form I need to fill out?" },
  { 
    role: "assistant", 
    content: "Yes, you need to download the 'International Return Authorization' form from your account dashboard and include it in the package. This ensures faster processing at our customs warehouse.",
    sources: [{ name: "shipping-guide.docx", page: 2, score: 92 }]
  },
];

export default function ConversationsPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden">
      {/* Left Column: List (35%) */}
      <div className="w-[35%] flex flex-col bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-background-deep border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["All", "Today", "This Week", "This Month"].map((chip) => (
              <button key={chip} className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                chip === "All" ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-on-surface-variant hover:text-white border border-transparent"
              }`}>
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/2 ${
                conv.active ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-on-surface-variant">{conv.id}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">{conv.time}</span>
              </div>
              <p className={`text-xs line-clamp-2 mb-3 ${conv.active ? "text-white" : "text-on-surface-variant"}`}>
                {conv.preview}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {conv.count} messages
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Detail (65%) */}
      <div className="flex-1 flex flex-col bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Detail Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">sess_a8f2...3d1e</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar size={10} /> Apr 24, 2024</span>
              <span className="flex items-center gap-1"><Clock size={10} /> 8 min duration</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-white transition-all">
              <Download size={18} />
            </button>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-error/10 text-on-surface-variant hover:text-error transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar bg-background-deep/30">
          {mockThread.map((msg, i) => (
            <MessageBubble key={i} role={msg.role as any} content={msg.content} sources={msg.sources} />
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white/2 border-t border-white/5 text-center">
          <p className="text-[10px] text-on-surface-variant font-medium">
            This conversation is encrypted end-to-end and stored securely.
          </p>
        </div>
      </div>
    </div>
  );
}
