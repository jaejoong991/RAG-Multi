"use client";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { Send, Paperclip, Mic, Settings2, Sparkles, Database, Terminal } from "lucide-react";

const mockMessages = [
  { role: "assistant", content: "Hello! I'm your AI assistant. Ask me anything about your knowledge base." },
  { role: "user", content: "What is the return policy for international orders?" },
  { 
    role: "assistant", 
    content: "Based on our catalog, international orders can be returned within 30 days. However, the customer is responsible for shipping costs and any applicable duties.",
    sources: [
      { name: "return-policy-2024.pdf", page: 12, score: 98 },
      { name: "shipping-guide.docx", page: 4, score: 84 }
    ]
  },
];

export default function PlaygroundPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Column: Chat Interface (65%) */}
      <div className="flex-1 flex flex-col bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_#10b981]" />
            <span className="text-sm font-semibold text-white">Chat Playground</span>
          </div>
          <button className="text-xs font-medium text-on-surface-variant hover:text-white transition-colors">
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          {mockMessages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role as any} content={msg.content} sources={msg.sources} />
          ))}
          <div className="flex items-center gap-2 px-4 animate-pulse">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
          </div>
        </div>

        <div className="p-4 bg-background-deep/50 border-t border-white/5">
          <div className="flex items-center gap-2 bg-background-deep border border-white/10 rounded-xl p-2 group-focus-within:border-primary/50 transition-all shadow-2xl">
            <button className="p-2 text-on-surface-variant hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2"
            />
            <button className="p-2 text-on-surface-variant hover:text-white transition-colors">
              <Mic size={20} />
            </button>
            <button className="primary-gradient p-2.5 rounded-lg text-white shadow-lg shadow-primary-container/20 active:scale-95 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Configuration (35%) */}
      <div className="w-[35%] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* Model Settings */}
        <div className="p-6 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Settings2 size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Model Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Provider</label>
              <select className="w-full bg-background-deep border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-primary/50 transition-all">
                <option>OpenAI</option>
                <option>Anthropic</option>
                <option>Google Gemini</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Model</label>
              <select className="w-full bg-background-deep border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-primary/50 transition-all">
                <option>gpt-4o-mini</option>
                <option>gpt-4-turbo</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Temperature</label>
                <span className="text-xs font-mono text-primary">0.3</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="p-6 glass-panel rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-secondary">
            <Terminal size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">System Prompt</h3>
          </div>
          <textarea 
            className="w-full h-32 bg-background-deep border border-white/10 rounded-xl p-3 text-xs font-mono text-on-surface-variant focus:border-secondary/50 outline-none resize-none"
            placeholder="Enter instructions for the AI..."
            defaultValue="You are a helpful AI assistant. Use the provided context to answer questions precisely."
          />
          <button className="text-[10px] font-bold text-secondary hover:underline uppercase tracking-widest">
            Reset to Default
          </button>
        </div>

        {/* Retrieval Settings */}
        <div className="p-6 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center gap-2 text-success">
            <Database size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Retrieval</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Top K Results</label>
                <span className="text-xs font-mono text-success">4</span>
              </div>
              <input type="range" min="1" max="10" className="w-full accent-success h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Min Similarity</label>
                <span className="text-xs font-mono text-success">0.7</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" className="w-full accent-success h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Response Info */}
        <div className="p-6 glass-panel rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-warning">
            <Sparkles size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Inference Info</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Tokens", value: "342 / 256" },
              { label: "Latency", value: "1.2s" },
              { label: "Cost", value: "$0.0012" },
              { label: "Sources", value: "4" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-lg p-2 border border-white/5">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
