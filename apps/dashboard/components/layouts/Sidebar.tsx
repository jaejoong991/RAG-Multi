import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  MessageSquare,
  Terminal,
  Sliders,
  Palette,
  Code,
  BarChart3,
  Users,
  Key,
  CreditCard,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";

const navItems = [
  { group: "MAIN", items: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Conversations", href: "/conversations", icon: MessageSquare },
    { name: "Playground", href: "/playground", icon: Terminal },
  ]},
  { group: "CONFIGURE", items: [
    { name: "Bot Settings", href: "/settings/bot", icon: Sliders },
    { name: "LLM Config", href: "/settings/llm", icon: Bot },
    { name: "Widget", href: "/settings/widget", icon: Palette },
    { name: "Embed Code", href: "/embed-code", icon: Code },
  ]},
  { group: "INSIGHTS", items: [
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ]},
  { group: "ACCOUNT", items: [
    { name: "Team", href: "/settings/team", icon: Users },
    { name: "API Keys", href: "/settings/api-keys", icon: Key },
    { name: "Billing", href: "/settings/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ]},
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/5 bg-background-deep h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-lg font-bold tracking-tight">RAG Platform</span>
        </div>

        <nav className="space-y-8">
          {navItems.map((group) => (
            <div key={group.group}>
              <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                  >
                    <item.icon size={18} className="group-hover:text-primary transition-colors" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-xs border border-white/10">
              JG
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">Jeff Gunawan</p>
              <p className="text-[10px] text-on-surface-variant truncate">jeff@example.com</p>
            </div>
          </div>
          <button className="text-on-surface-variant hover:text-error transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
