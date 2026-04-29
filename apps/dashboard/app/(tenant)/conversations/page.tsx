"use client";

import { useEffect, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Search, Trash2, Calendar } from "lucide-react";
import { apiDelete, apiGet } from "@/lib/api";

interface ConversationDto {
  id: string;
  tenantId: string;
  externalId?: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MessageDto {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ConversationWithMessagesDto extends ConversationDto {
  messages: MessageDto[];
}

interface ConversationsResponse {
  success: boolean;
  data: ConversationDto[];
  meta: { total: number; page: number; limit: number };
}

interface ConversationDetailResponse {
  success: boolean;
  data: ConversationWithMessagesDto;
}

function truncateId(id: string): string {
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<MessageDto[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchConversations() {
      try {
        setIsLoadingList(true);
        setListError(null);
        const res = await apiGet<ConversationsResponse>("/api/v1/conversations");
        setConversations(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }
      } catch (err) {
        setListError(err instanceof Error ? err.message : "Failed to load conversations");
      } finally {
        setIsLoadingList(false);
      }
    }
    void fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    async function fetchThread() {
      try {
        setIsLoadingThread(true);
        setThreadError(null);
        const res = await apiGet<ConversationDetailResponse>(`/api/v1/conversations/${selectedId}`);
        setThread(res.data.messages);
      } catch (err) {
        setThreadError(err instanceof Error ? err.message : "Failed to load messages");
      } finally {
        setIsLoadingThread(false);
      }
    }
    void fetchThread();
  }, [selectedId]);

  async function handleDelete(id: string) {
    try {
      await apiDelete(`/api/v1/conversations/${id}`);
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (selectedId === id) {
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        setThread([]);
      }
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const filteredConversations = conversations.filter((c) =>
    c.id.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedConversation = conversations.find((c) => c.id === selectedId);

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background-deep border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoadingList ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listError ? (
            <div className="p-4 text-error text-xs">{listError}</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-xs">No conversations found.</div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === selectedId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/2 ${
                    isActive ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-on-surface-variant">{truncateId(conv.id)}</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {conv.messageCount} messages
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Detail (65%) */}
      <div className="flex-1 flex flex-col bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono">{truncateId(selectedConversation.id)}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(selectedConversation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => void handleDelete(selectedConversation.id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-error/10 text-on-surface-variant hover:text-error transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar bg-background-deep/30">
              {isLoadingThread ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : threadError ? (
                <div className="text-error text-sm">{threadError}</div>
              ) : (
                thread.map((msg) => (
                  <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))
              )}
            </div>

            <div className="p-3 bg-white/2 border-t border-white/5 text-center">
              <p className="text-[10px] text-on-surface-variant font-medium">
                This conversation is encrypted end-to-end and stored securely.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm">
            Select a conversation to view messages.
          </div>
        )}
      </div>
    </div>
  );
}
