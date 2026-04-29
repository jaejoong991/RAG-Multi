"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Send, Settings2, Sparkles, Database, Terminal } from "lucide-react";
import { apiPost } from "@/lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ name: string; page: number; score: number }>;
}

interface QueryResponse {
  success: boolean;
  data: {
    answer: string;
    sources: Array<{ name: string; page: number; score: number }>;
    conversationId: string;
    messageId: string;
  };
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI assistant. Ask me anything about your knowledge base.",
};

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const query = input.trim();
    if (!query || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await apiPost<QueryResponse>("/api/v1/chat/query", {
        query,
        conversationId,
      });

      if (!conversationId) {
        setConversationId(res.data.conversationId);
      }

      const assistantMessage: ChatMessage = {
        id: res.data.messageId,
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get a response");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleClear() {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(undefined);
    setError(null);
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Column: Chat Interface (65%) */}
      <div className="flex-1 flex flex-col bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_#10b981]" />
            <span className="text-sm font-semibold text-white">Chat Playground</span>
          </div>
          <button
            onClick={handleClear}
            className="text-xs font-medium text-on-surface-variant hover:text-white transition-colors"
          >
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} sources={msg.sources} />
          ))}
          {isSending && (
            <div className="flex items-center gap-2 px-4 animate-pulse">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
              <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-4 mb-2 bg-error/10 border border-error/20 rounded-lg p-3 text-error text-xs">
            {error}
          </div>
        )}

        <div className="p-4 bg-background-deep/50 border-t border-white/5">
          <div className="flex items-center gap-2 bg-background-deep border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-all shadow-2xl">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 disabled:opacity-50"
            />
            <button
              onClick={() => void handleSend()}
              disabled={isSending || !input.trim()}
              className="primary-gradient p-2.5 rounded-lg text-white shadow-lg shadow-primary-container/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
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
              { label: "Messages", value: String(messages.length) },
              { label: "Context", value: conversationId ? "Active" : "New" },
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
