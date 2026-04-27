"use client";

import { Palette, Settings2, Eye, Layout, Plus, X } from "lucide-react";

export default function WidgetCustomizationPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden pb-4">
      {/* Left: Settings (55%) */}
      <div className="w-[55%] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Widget Customization</h1>
          <p className="text-on-surface-variant">Design the look and feel of your embeddable chat assistant.</p>
        </div>

        {/* Appearance Card */}
        <div className="p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Palette size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Appearance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Widget Title</label>
              <input type="text" defaultValue="AI Assistant" className="w-full bg-background-deep border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Primary Color</label>
              <div className="flex items-center gap-3 p-2.5 bg-background-deep border border-white/10 rounded-lg">
                <div className="w-6 h-6 rounded bg-[#7C3AED]" />
                <span className="text-xs font-mono text-white">#7C3AED</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Welcome Message</label>
            <textarea className="w-full h-24 bg-background-deep border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none resize-none" defaultValue="Hi! How can I help you today?" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Position</label>
              <select className="w-full bg-background-deep border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                <option>Bottom Right</option>
                <option>Bottom Left</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Button Size</label>
              <select className="w-full bg-background-deep border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                <option>Medium</option>
                <option>Large</option>
                <option>Small</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Theme</label>
              <select className="w-full bg-background-deep border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Behavior Card */}
        <div className="p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center gap-3 text-secondary">
            <Settings2 size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Behavior</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Initial State</p>
                <p className="text-[10px] text-on-surface-variant">How the widget appears on page load</p>
              </div>
              <div className="flex bg-background-deep p-1 rounded-lg border border-white/5">
                {["Closed", "Open"].map((opt) => (
                  <button key={opt} className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                    opt === "Closed" ? "bg-white/10 text-white shadow-lg" : "text-on-surface-variant hover:text-white"
                  }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Opening Delay (seconds)</label>
              <input type="number" defaultValue={3} className="w-24 bg-background-deep border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Suggested Questions</label>
                <button className="text-[10px] font-bold text-secondary flex items-center gap-1 hover:underline">
                  <Plus size={12} /> Add Question
                </button>
              </div>
              <div className="space-y-2">
                {[
                  "What is your return policy?",
                  "How do I track my order?"
                ].map((q) => (
                  <div key={q} className="flex items-center gap-2 p-2.5 bg-background-deep border border-white/5 rounded-lg group">
                    <p className="flex-1 text-xs text-on-surface-variant">{q}</p>
                    <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error transition-all">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Preview (45%) */}
      <div className="flex-1 bg-[#020617] rounded-3xl relative flex flex-col border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-4 left-6 flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
          <Eye size={12} />
          Live Preview
        </div>

        {/* Mock Website Background */}
        <div className="mt-12 p-8 space-y-6 opacity-30 pointer-events-none select-none">
          <div className="h-8 w-48 bg-white/10 rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
            <div className="h-4 w-4/6 bg-white/5 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="h-40 bg-white/5 rounded-2xl" />
            <div className="h-40 bg-white/5 rounded-2xl" />
          </div>
        </div>

        {/* THE WIDGET PREVIEW */}
        <div className="absolute bottom-8 right-8 flex flex-col items-end scale-90 origin-bottom-right">
          {/* Expanded window */}
          <div className="w-80 h-[480px] bg-surface-card rounded-2xl shadow-3xl border border-white/10 flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-4">
            <div className="p-4 primary-gradient flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <span className="text-sm font-bold text-white tracking-tight">AI Assistant</span>
              </div>
              <button className="text-white/80 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="flex-1 p-4 space-y-4">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 text-xs text-on-surface-variant leading-relaxed">
                  Hi! How can I help you today?
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pl-8">
                {["Return policy", "Order status"].map((tag) => (
                  <button key={tag} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-background-deep/50 space-y-3">
              <div className="relative">
                <input type="text" placeholder="Ask a question..." className="w-full bg-background-deep border border-white/10 rounded-full px-4 py-2.5 text-[11px] outline-none" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Settings2 size={12} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-[0.2em] opacity-50">Powered by RAG Platform</p>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="w-16 h-16 rounded-full primary-gradient shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all">
            <Layout size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
