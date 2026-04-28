"use client";

import { useState, useEffect } from "react";
import { Bot, Key, Server, Sliders, Save, Eye, EyeOff } from "lucide-react";

type LLMMode = "managed" | "byok" | "byoe";
type LLMProvider = "openai" | "anthropic" | "gemini" | "ollama";

interface LLMConfig {
  mode: LLMMode;
  provider: LLMProvider;
  model: string;
  apiKey: string;
  endpointUrl: string;
  temperature: number;
  systemPrompt: string;
}

interface ModeCard {
  id: LLMMode;
  label: string;
  description: string;
  icon: typeof Bot;
}

const MODE_CARDS: ModeCard[] = [
  {
    id: "managed",
    label: "Managed",
    description: "We handle the API keys, billed per usage",
    icon: Bot,
  },
  {
    id: "byok",
    label: "BYOK",
    description: "Use your own OpenAI / Anthropic / Gemini API key",
    icon: Key,
  },
  {
    id: "byoe",
    label: "BYOE",
    description: "Self-hosted Ollama or vLLM endpoint",
    icon: Server,
  },
];

const PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "gemini", label: "Gemini" },
  { value: "ollama", label: "Ollama" },
];

const DEFAULT_CONFIG: LLMConfig = {
  mode: "managed",
  provider: "openai",
  model: "gpt-4o-mini",
  apiKey: "",
  endpointUrl: "",
  temperature: 0.3,
  systemPrompt: "",
};

function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("firebaseIdToken") ?? "";
}

async function fetchLLMConfig(): Promise<Partial<LLMConfig>> {
  const token = getAuthToken();
  const res = await fetch("/api/v1/llm-config", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to load LLM config: ${res.statusText}`);
  const json = await res.json();
  return (json.data ?? {}) as Partial<LLMConfig>;
}

async function saveLLMConfig(config: LLMConfig): Promise<void> {
  const token = getAuthToken();
  const res = await fetch("/api/v1/llm-config", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`Failed to save LLM config: ${res.statusText}`);
}

export default function LLMConfigPage() {
  const [config, setConfig] = useState<LLMConfig>(DEFAULT_CONFIG);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchLLMConfig()
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {
        // Leave defaults if the endpoint is not yet reachable
      });
  }, []);

  function updateConfig<K extends keyof LLMConfig>(key: K, value: LLMConfig[K]): void {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(): Promise<void> {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await saveLLMConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unexpected error while saving");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">LLM Configuration</h1>
          <p className="text-on-surface-variant mt-2">
            Choose how your tenant connects to language models and configure runtime parameters.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="primary-gradient text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {saveError !== null && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-sm text-success">
          Configuration saved successfully.
        </div>
      )}

      {/* Section 1: LLM Mode */}
      <div className="p-8 glass-panel rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">LLM Mode</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODE_CARDS.map(({ id, label, description, icon: Icon }) => {
            const isActive = config.mode === id;
            return (
              <button
                key={id}
                onClick={() => updateConfig("mode", id)}
                className={`glass-panel p-6 rounded-xl border text-left transition-all space-y-3 ${
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Icon
                  size={22}
                  className={isActive ? "text-primary" : "text-on-surface-variant"}
                />
                <div>
                  <p className={`text-sm font-bold ${isActive ? "text-white" : "text-on-surface-variant"}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Provider + Model */}
      <div className="p-8 glass-panel rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Sliders size={20} className="text-secondary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Provider &amp; Model</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Provider
            </label>
            <select
              value={config.provider}
              onChange={(e) => updateConfig("provider", e.target.value as LLMProvider)}
              className="w-full bg-background-deep border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-primary/50"
            >
              {PROVIDERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Model Name
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => updateConfig("model", e.target.value)}
              placeholder="e.g. gpt-4o-mini, claude-3-haiku, gemini-1.5-flash"
              className="w-full bg-background-deep border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-primary/50 placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>
      </div>

      {/* Section 3: API Key — BYOK only */}
      {config.mode === "byok" && (
        <div className="p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Key size={20} className="text-warning" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">API Key</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Your API Key (stored encrypted)
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={config.apiKey}
                onChange={(e) => updateConfig("apiKey", e.target.value)}
                placeholder="sk-…"
                className="w-full bg-background-deep border border-white/10 rounded-lg p-3 pr-12 text-sm text-white outline-none focus:border-primary/50 placeholder:text-on-surface-variant/50"
              />
              <button
                type="button"
                onClick={() => setShowApiKey((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Endpoint URL — BYOE only */}
      {config.mode === "byoe" && (
        <div className="p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Server size={20} className="text-success" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Endpoint URL</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Self-Hosted Endpoint
            </label>
            <input
              type="text"
              value={config.endpointUrl}
              onChange={(e) => updateConfig("endpointUrl", e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full bg-background-deep border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-primary/50 placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>
      )}

      {/* Section 5: Temperature */}
      <div className="p-8 glass-panel rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Sliders size={20} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Temperature</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Creativity vs Precision
            </label>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
              {config.temperature.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => updateConfig("temperature", parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">
            <span>Precise (0.0)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>
      </div>

      {/* Section 6: System Prompt */}
      <div className="p-8 glass-panel rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-secondary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">System Prompt</h3>
        </div>

        <textarea
          value={config.systemPrompt}
          onChange={(e) => updateConfig("systemPrompt", e.target.value)}
          placeholder="Enter a default system prompt for this LLM configuration…"
          rows={6}
          className="w-full bg-background-deep border border-white/10 rounded-xl p-4 text-sm font-mono text-on-surface-variant focus:border-secondary/50 outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
