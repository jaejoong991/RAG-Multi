import { PrismaClient } from '@prisma/client';
import { EmbeddingService } from './embedding.service';

export interface RetrievalConfig {
  topK?: number;
  minScore?: number;
}

export class RetrievalService {
  private prisma: PrismaClient;

  constructor(private embeddingService: EmbeddingService) {
    this.prisma = new PrismaClient();
  }

  async search(tenantId: string, query: string, config: RetrievalConfig = {}) {
    const topK = config.topK || 4;
    const minScore = config.minScore || 0.7;

    // 1. Embed query
    const embedding = await this.embeddingService.embedText(query);
    const vectorString = `[${embedding.join(',')}]`;

    // 2. Search using pgvector cosine distance
    // We join with documents table to ensure tenant isolation
    const results = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        c.id, 
        c.content, 
        c.metadata, 
        d.name as "documentName",
        1 - (c.embedding <=> $1::vector) as score
      FROM document_chunks c
      JOIN documents d ON c."documentId" = d.id
      WHERE d."tenantId" = $2
      AND 1 - (c.embedding <=> $1::vector) >= $3
      ORDER BY c.embedding <=> $1::vector ASC
      LIMIT $4
    `, vectorString, tenantId, minScore, topK);

    return results;
  }
}
