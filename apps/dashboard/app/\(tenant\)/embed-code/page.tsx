"use client";

import { Code, Copy, CheckCircle2, Globe, ArrowRight, RefreshCcw } from "lucide-react";

export default function EmbedCodePage() {
  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Install Chat Widget</h1>
        <p className="text-on-surface-variant">Add your custom-trained AI assistant to any website in minutes.</p>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 hidden md:block z-0" />
        {[
          { step: 1, label: "Copy Code", desc: "Get your script snippet", active: true },
          { step: 2, label: "Paste in Site", desc: "Add to your HTML body", active: false },
          { step: 3, label: "Verify", desc: "Check connection status", active: false },
        ].map((s) => (
          <div key={s.step} className={`relative z-10 p-4 rounded-xl border flex items-center gap-4 ${
            s.active ? "bg-primary/5 border-primary/40 shadow-lg shadow-primary/5" : "bg-surface-card border-white/5"
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              s.active ? "bg-primary text-white" : "bg-white/5 text-on-surface-variant"
            }`}>
              {s.step}
            </div>
            <div>
              <p className={`text-sm font-bold ${s.active ? "text-white" : "text-on-surface-variant"}`}>{s.label}</p>
              <p className="text-[10px] text-on-surface-variant font-medium">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Code Block */}
          <div className="glass-panel rounded-2xl overflow-hidden border-white/10">
            <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-primary/10 text-primary">
                  <Code size={16} />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Global Script Snippet</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all">
                <Copy size={14} />
                Copy Snippet
              </button>
            </div>
            <div className="p-6 bg-[#011627] font-mono text-xs leading-relaxed text-blue-300/80">
              <pre>
{`<!-- RAG Platform Widget -->
<script 
  src="https://cdn.ragplatform.com/v1/loader.js" 
  data-api-key="tk_live_xxxxxxxxxxxxxxxxxx"
  data-theme="dark"
  data-position="bottom-right">
</script>`}
              </pre>
            </div>
          </div>

          {/* Integration Guides */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Integration Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "React / Next.js", desc: "Use our custom hook for full control." },
                { name: "WordPress", desc: "Install our plugin to inject code." },
                { name: "Shopify", desc: "Add to your theme.liquid file." },
                { name: "Plain HTML", desc: "Simple copy-paste into <body>." }
              ].map((guide) => (
                <div key={guide.name} className="p-5 glass-panel rounded-xl border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{guide.name}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{guide.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                    View Guide <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 glass-panel rounded-2xl space-y-6 border-warning/20 bg-warning/5">
            <div className="flex items-center gap-3 text-warning">
              <CheckCircle2 size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Verification</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Paste your website URL below to verify if the widget is installed correctly.
              </p>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  type="text" 
                  placeholder="https://example.com" 
                  className="w-full bg-background-deep border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-warning/50 transition-all"
                />
              </div>
              <button className="w-full py-2.5 rounded-lg border border-warning/30 text-warning text-[10px] font-bold uppercase tracking-widest hover:bg-warning/10 transition-all flex items-center justify-center gap-2">
                <RefreshCcw size={14} />
                Check Installation
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Current Status</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                <span className="text-[10px] font-bold text-warning uppercase">Awaiting Data</span>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="p-6 glass-panel rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Your Widget API Key</h3>
            <div className="bg-background-deep border border-white/10 rounded-lg p-3 flex items-center justify-between group">
              <code className="text-[10px] font-mono text-on-surface-variant">tk_live_xxxx...3d1e</code>
              <button className="text-on-surface-variant hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                <Copy size={14} />
              </button>
            </div>
            <p className="text-[9px] text-on-surface-variant leading-relaxed">
              This key is scoped specifically for the chat widget. For backend API access, use an <span className="text-primary cursor-pointer hover:underline">Integrations Key</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
