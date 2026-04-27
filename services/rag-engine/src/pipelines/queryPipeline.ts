import { RetrievalService } from '../services/retrieval.service';
import { GenerationService } from '../services/generation.service';

export class QueryPipeline {
  constructor(
    private retrievalService: RetrievalService,
    private generationService: GenerationService
  ) {}

  async run(tenantId: string, query: string, systemPrompt?: string) {
    // 1. Retrieve
    const sources = await this.retrievalService.search(tenantId, query);

    // 2. Format Context
    const context = sources
      .map((s: any) => `Source: ${s.documentName}\nContent: ${s.content}`)
      .join('\n\n');

    // 3. Generate
    const response = await this.generationService.generate(query, context, systemPrompt);

    return {
      answer: response.content,
      sources: sources.map((s: any) => ({
        id: s.id,
        documentName: s.documentName,
        score: s.score,
        metadata: s.metadata,
      })),
      usage: response.usage,
    };
  }
}
