import { Search, Bell, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
        <span>Dashboard</span>
        <span className="text-white/20">/</span>
        <span className="text-white">Documents</span>
      </div>

      <div className="flex-1 max-w-xl px-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search documents, conversations..." 
            className="w-full bg-background-deep border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-container transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-on-surface-variant hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-xs font-semibold text-white">Acme Corp</p>
            <p className="text-[10px] text-on-surface-variant">Enterprise Plan</p>
          </div>
          <ChevronDown size={16} className="text-on-surface-variant group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
}
