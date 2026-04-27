import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";
import { ShieldCheck } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Super Admin specialized Sidebar/Header if needed, otherwise reuse */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-primary/10 border-b border-primary/20 px-8 py-2 flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Super Admin Environment</span>
        </div>
        <Header />
        <main className="p-8 flex-1 overflow-y-auto bg-background-deep">
          {children}
        </main>
      </div>
    </div>
  );
}
