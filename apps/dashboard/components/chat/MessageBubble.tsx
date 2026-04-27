import { Bot, User, BookOpen } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

export function MessageBubble({ role, content, sources }: MessageProps) {
  const isBot = role === "assistant";

  return (
    <div className={`flex flex-col gap-3 max-w-[85%] ${isBot ? "self-start" : "self-end"}`}>
      <div className={`flex items-center gap-2 px-1 ${isBot ? "" : "justify-end"}`}>
        {isBot ? (
          <>
            <Bot size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Assistant</span>
          </>
        ) : (
          <>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Admin</span>
            <User size={14} className="text-secondary" />
          </>
        )}
      </div>

      <div className={`p-4 rounded-2xl ${
        isBot 
          ? "bg-surface-card border border-white/5 rounded-tl-none text-on-surface" 
          : "primary-gradient text-white rounded-tr-none shadow-lg shadow-primary-container/10"
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        
        {isBot && sources && sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <BookOpen size={12} />
              Sources Found ({sources.length})
            </div>
            <div className="grid grid-cols-1 gap-2">
              {sources.map((source, i) => (
                <div key={i} className="p-2 bg-background-deep/50 rounded-lg border border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-[11px] font-medium text-white">{source.name}</p>
                      <p className="text-[9px] text-on-surface-variant">Page {source.page} • {source.score}% Relevance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
