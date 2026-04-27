"use client";

import { Settings2, Terminal, Database, Sparkles, Save, RotateCcw } from "lucide-react";

export default function BotSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Bot Configuration</h1>
          <p className="text-on-surface-variant mt-2">
            Fine-tune your AI assistant's personality, knowledge retrieval, and model behavior.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg border border-white/5 text-sm font-bold text-on-surface-variant hover:bg-white/5 transition-all flex items-center gap-2">
            <RotateCcw size={16} />
            Discard
          </button>
          <button className="primary-gradient text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Section 1: AI Model */}
        <div className="p-8 glass-panel rounded-2xl space-y-8">
          <div className="flex items-center gap-3 text-primary">
            <Settings2 size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">AI Model & Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Model Provider</label>
              <div className="grid grid-cols-2 gap-3">
                {["OpenAI", "Anthropic", "Google", "Ollama"].map((p) => (
                  <button key={p} className={`p-4 rounded-xl border transition-all text-sm font-semibold ${
                    p === "OpenAI" ? "bg-primary/10 border-primary text-white" : "bg-white/2 border-white/5 text-on-surface-variant hover:border-white/10"
                  }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Model Selection</label>
                <select className="w-full bg-background-deep border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-primary/50">
                  <option>gpt-4o-mini (Recommended)</option>
                  <option>gpt-4-turbo</option>
                  <option>gpt-3.5-turbo</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Temperature</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">0.3</span>
                </div>
                <input type="range" min="0" max="1" step="0.1" className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" defaultValue="0.3" />
                <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: System Prompt */}
        <div className="p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-secondary">
              <Terminal size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">System Instructions</h3>
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant">234 / 2000 characters</span>
          </div>
          
          <textarea 
            className="w-full h-48 bg-background-deep border border-white/10 rounded-xl p-4 text-sm font-mono text-on-surface-variant focus:border-secondary/50 outline-none resize-none leading-relaxed"
            placeholder="Describe your bot's personality and rules..."
            defaultValue="You are a senior technical support assistant for Acme Corp. Use the provided documentation to answer customer questions. Be professional, concise, and always cite your sources. If you don't know the answer, politely redirect them to a human agent."
          />
          
          <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-lg">
            <p className="text-xs text-secondary/80 leading-relaxed">
              <strong>Tip:</strong> This prompt defines the "brain" of your bot. Use it to set tone, language preferences, and safety boundaries.
            </p>
          </div>
        </div>

        {/* Section 3: Retrieval & Behavior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 glass-panel rounded-2xl space-y-6">
            <div className="flex items-center gap-3 text-success">
              <Database size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Retrieval Logic</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Top K Chunks</label>
                  <span className="text-xs font-mono text-success bg-success/10 px-2 py-0.5 rounded">4</span>
                </div>
                <input type="range" min="1" max="10" className="w-full accent-success h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" defaultValue="4" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Similarity Threshold</label>
                  <span className="text-xs font-mono text-success bg-success/10 px-2 py-0.5 rounded">0.75</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" className="w-full accent-success h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" defaultValue="0.75" />
              </div>
            </div>
          </div>

          <div className="p-8 glass-panel rounded-2xl space-y-6">
            <div className="flex items-center gap-3 text-warning">
              <Sparkles size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Response Behavior</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Show Source Citations", desc: "Include links to source documents", active: true },
                { label: "General Knowledge Fallback", desc: "Use LLM knowledge if no docs found", active: false },
                { label: "Multi-turn Memory", desc: "Maintain conversation context", active: true },
                { label: "Stream Responses", desc: "Display text as it's generated", active: true },
              ].map((toggle) => (
                <div key={toggle.label} className="flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-medium text-white">{toggle.label}</p>
                    <p className="text-[10px] text-on-surface-variant">{toggle.desc}</p>
                  </div>
                  <button className={`w-10 h-5 rounded-full relative transition-all ${toggle.active ? "bg-primary" : "bg-white/10"}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${toggle.active ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
