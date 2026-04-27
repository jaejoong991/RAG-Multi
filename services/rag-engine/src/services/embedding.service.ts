import { OpenAIEmbeddings } from '@langchain/openai';
import { Embeddings } from '@langchain/core/embeddings';

export interface EmbeddingConfig {
  provider: 'openai'; // Currently only OpenAI supported for simplicity
  modelName: string;
  apiKey?: string;
}

export class EmbeddingService {
  private embeddings: Embeddings;

  constructor(config: EmbeddingConfig) {
    if (config.provider === 'openai') {
      this.embeddings = new OpenAIEmbeddings({
        modelName: config.modelName,
        openAIApiKey: config.apiKey || process.env.OPENAI_API_KEY,
      });
    } else {
      throw new Error(`Unsupported embedding provider: ${config.provider}`);
    }
  }

  async embedText(text: string): Promise<number[]> {
    return await this.embeddings.embedQuery(text);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return await this.embeddings.embedDocuments(texts);
  }
}
