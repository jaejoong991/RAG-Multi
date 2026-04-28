import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOllama } from '@langchain/ollama';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export type LLMProvider = 'openai' | 'google' | 'anthropic' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  endpointUrl?: string;
}

export class LLMFactory {
  static create(config: LLMConfig): BaseChatModel {
    switch (config.provider) {
      case 'openai':
        return new ChatOpenAI({
          modelName: config.modelName,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          openAIApiKey: config.apiKey || process.env.OPENAI_API_KEY,
        });

      case 'google':
        return new ChatGoogleGenerativeAI({
          modelName: config.modelName,
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
          apiKey: config.apiKey || process.env.GEMINI_API_KEY,
        });

      case 'anthropic':
        return new ChatAnthropic({
          modelName: config.modelName,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          anthropicApiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
        });

      case 'ollama':
        return new ChatOllama({
          model: config.modelName,
          temperature: config.temperature,
          baseUrl: config.endpointUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        });

      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }
}
