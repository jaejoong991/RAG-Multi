import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { EmbeddingService } from '../services/embedding.service';

export interface IndexPipelineConfig {
  chunkSize?: number;
  chunkOverlap?: number;
}

export class IndexPipeline {
  private splitter: RecursiveCharacterTextSplitter;

  constructor(
    private embeddingService: EmbeddingService,
    config: IndexPipelineConfig = {}
  ) {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200,
    });
  }

  async run(text: string, metadata: Record<string, any> = {}) {
    // 1. Chunk
    const docs = await this.splitter.createDocuments([text], [metadata]);

    // 2. Embed
    const contents = docs.map((d) => d.pageContent);
    const embeddings = await this.embeddingService.embedDocuments(contents);

    // 3. Return results for storage
    return docs.map((doc, i) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      embedding: embeddings[i],
    }));
  }
}
