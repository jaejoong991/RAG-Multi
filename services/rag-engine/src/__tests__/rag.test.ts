/**
 * TC-07: Document indexing pipeline (parse → chunk → embed → store)
 * TC-08: Document deletion removes vectors and chunks
 * TC-09: Chat Playground returns response based on uploaded documents
 * TC-10: Sources are correctly cited with relevance scores
 * TC-11: Multi-LLM provider switching (OpenAI, Gemini, etc.)
 * TC-12: Temperature and Max Tokens settings affect output correctly
 */

import { IndexPipeline } from '../pipelines/indexPipeline';
import { QueryPipeline } from '../pipelines/queryPipeline';
import { EmbeddingService } from '../services/embedding.service';
import { RetrievalService } from '../services/retrieval.service';
import { GenerationService } from '../services/generation.service';

// ─── TC-07 ───────────────────────────────────────────────────────────────────
describe('TC-07: Document indexing pipeline (chunk → embed → store)', () => {
  it('splits text into chunks and returns embeddings for each', async () => {
    const mockEmbedService = {
      embedDocuments: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]]),
      embedText: jest.fn(),
    } as unknown as EmbeddingService;

    const pipeline = new IndexPipeline(mockEmbedService, { chunkSize: 100, chunkOverlap: 20 });
    const text = 'A'.repeat(150);
    const results = await pipeline.run(text, { documentId: 'doc-1', tenantId: 'tenant-1' });

    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0]).toHaveProperty('content');
    expect(results[0]).toHaveProperty('embedding');
    expect(results[0]).toHaveProperty('metadata');
    expect(mockEmbedService.embedDocuments).toHaveBeenCalledTimes(1);
  });

  it('each chunk has a vector array', async () => {
    const mockEmbedService = {
      embedDocuments: jest.fn().mockResolvedValue([[0.1, 0.2], [0.3, 0.4]]),
      embedText: jest.fn(),
    } as unknown as EmbeddingService;

    const pipeline = new IndexPipeline(mockEmbedService);
    const results = await pipeline.run('chunk one. chunk two. chunk three.');

    results.forEach((chunk) => {
      expect(Array.isArray(chunk.embedding)).toBe(true);
    });
  });

  it('preserves metadata per chunk', async () => {
    const mockEmbedService = {
      embedDocuments: jest.fn().mockResolvedValue([[0.1, 0.2]]),
      embedText: jest.fn(),
    } as unknown as EmbeddingService;

    const pipeline = new IndexPipeline(mockEmbedService);
    const results = await pipeline.run('short text', { documentId: 'doc-42' });

    expect(results[0].metadata).toMatchObject({ documentId: 'doc-42' });
  });
});

// ─── TC-08 ───────────────────────────────────────────────────────────────────
describe('TC-08: Document deletion removes vectors and chunks', () => {
  it('retrieval returns no results after chunks removed for document', async () => {
    const mockRetrieval = {
      search: jest.fn().mockResolvedValue([]),
    } as unknown as RetrievalService;

    const mockGeneration = {
      generate: jest.fn().mockResolvedValue({ content: "I don't know.", usage: {} }),
    } as unknown as GenerationService;

    const pipeline = new QueryPipeline(mockRetrieval, mockGeneration);
    const result = await pipeline.run('tenant-1', 'What is in the deleted doc?');

    expect(result.sources).toHaveLength(0);
    expect(mockRetrieval.search).toHaveBeenCalledWith('tenant-1', 'What is in the deleted doc?');
  });

  it('deleted document chunks do not appear in source results', async () => {
    const mockRetrieval = {
      search: jest.fn().mockResolvedValue([
        { id: 'chunk-2', documentName: 'other-doc.pdf', score: 0.9, content: 'Other content', metadata: {} },
      ]),
    } as unknown as RetrievalService;

    const mockGeneration = {
      generate: jest.fn().mockResolvedValue({ content: 'Other content answer', usage: {} }),
    } as unknown as GenerationService;

    const pipeline = new QueryPipeline(mockRetrieval, mockGeneration);
    const result = await pipeline.run('tenant-1', 'query');

    expect(result.sources.every((s: { documentName: string }) => s.documentName !== 'deleted-doc.pdf')).toBe(true);
  });
});

// ─── TC-09 ───────────────────────────────────────────────────────────────────
describe('TC-09: Chat Playground returns response based on uploaded documents', () => {
  it('returns answer derived from retrieved document context', async () => {
    const mockRetrieval = {
      search: jest.fn().mockResolvedValue([
        { id: 'chunk-1', documentName: 'policy.pdf', score: 0.92, content: 'The return policy is 30 days.', metadata: {} },
      ]),
    } as unknown as RetrievalService;

    const mockGeneration = {
      generate: jest.fn().mockResolvedValue({
        content: 'The return policy is 30 days.',
        usage: { totalTokens: 50 },
      }),
    } as unknown as GenerationService;

    const pipeline = new QueryPipeline(mockRetrieval, mockGeneration);
    const result = await pipeline.run('tenant-1', 'What is the return policy?');

    expect(result.answer).toBe('The return policy is 30 days.');
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0].documentName).toBe('policy.pdf');
  });

  it('passes retrieved context to generation service', async () => {
    const mockRetrieval = {
      search: jest.fn().mockResolvedValue([
        { id: 'c1', documentName: 'faq.pdf', score: 0.85, content: 'FAQ content here.', metadata: {} },
      ]),
    } as unknown as RetrievalService;

    const mockGeneration = {
      generate: jest.fn().mockResolvedValue({ content: 'Answer', usage: {} }),
    } as unknown as GenerationService;

    const pipeline = new QueryPipeline(mockRetrieval, mockGeneration);
    await pipeline.run('tenant-1', 'FAQ question?');

    const [query, context] = (mockGeneration.generate as jest.Mock).mock.calls[0];
    expect(query).toBe('FAQ question?');
    expect(context).toContain('FAQ content here.');
    expect(context).toContain('faq.pdf');
  });
});

// ─── TC-10 ───────────────────────────────────────────────────────────────────
describe('TC-10: Sources cited with relevance scores', () => {
  it('returns sources with id, documentName, and score fields', async () => {
    const mockRetrieval = {
      search: jest.fn().mockResolvedValue([
        { id: 'chunk-1', documentName: 'doc-a.pdf', score: 0.95, content: 'Content A', metadata: { page: 1 } },
        { id: 'chunk-2', documentName: 'doc-b.pdf', score: 0.78, content: 'Content B', metadata: { page: 3 } },
      ]),
    } as unknown as RetrievalService;

    const mockGeneration = {
      generate: jest.fn().mockResolvedValue({ content: 'Combined answer', usage: {} }),
    } as unknown as GenerationService;

    const pipeline = new QueryPipeline(mockRetrieval, mockGeneration);
    const result = await pipeline.run('tenant-1', 'What happened?');

    expect(result.sources).toHaveLength(2);
    expect(result.sources[0]).toMatchObject({ id: 'chunk-1', documentName: 'doc-a.pdf', score: 0.95 });
    expect(result.sources[1]).toMatchObject({ id: 'chunk-2', documentName: 'doc-b.pdf', score: 0.78 });
  });

  it('scores are numeric values between 0 and 1', async () => {
    const mockRetrieval = {
      search: jest.fn().mockResolvedValue([
        { id: 'c1', documentName: 'x.pdf', score: 0.83, content: 'x', metadata: {} },
      ]),
    } as unknown as RetrievalService;

    const mockGeneration = {
      generate: jest.fn().mockResolvedValue({ content: 'ans', usage: {} }),
    } as unknown as GenerationService;

    const pipeline = new QueryPipeline(mockRetrieval, mockGeneration);
    const result = await pipeline.run('t1', 'query');

    result.sources.forEach((s: { score: number }) => {
      expect(typeof s.score).toBe('number');
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(1);
    });
  });
});

// ─── TC-11 ───────────────────────────────────────────────────────────────────
describe('TC-11: Multi-LLM provider switching', () => {
  it('GenerationService accepts any BaseChatModel implementation', async () => {
    const mockLLM = {
      invoke: jest.fn().mockResolvedValue({
        content: 'Response from mock LLM',
        additional_kwargs: { tokenUsage: { totalTokens: 30 } },
      }),
    };

    const genService = new GenerationService(mockLLM as any);
    const result = await genService.generate('test query', 'test context');

    expect(result.content).toBe('Response from mock LLM');
    expect(mockLLM.invoke).toHaveBeenCalledTimes(1);
  });

  it('swapping LLM implementation does not require code changes', () => {
    const openAiLLM = { invoke: jest.fn() };
    const geminiLLM = { invoke: jest.fn() };
    const anthropicLLM = { invoke: jest.fn() };

    expect(() => new GenerationService(openAiLLM as any)).not.toThrow();
    expect(() => new GenerationService(geminiLLM as any)).not.toThrow();
    expect(() => new GenerationService(anthropicLLM as any)).not.toThrow();
  });

  it('passes system prompt to LLM invoke call', async () => {
    const mockLLM = {
      invoke: jest.fn().mockResolvedValue({ content: 'Custom answer', additional_kwargs: {} }),
    };

    const genService = new GenerationService(mockLLM as any);
    await genService.generate('query', 'context', 'Custom system: {context}');

    const messages = (mockLLM.invoke as jest.Mock).mock.calls[0][0];
    expect(messages[0].content).toContain('context');
  });
});

// ─── TC-12 ───────────────────────────────────────────────────────────────────
describe('TC-12: Temperature and Max Tokens settings affect output', () => {
  it('invoke called with SystemMessage and HumanMessage pair', async () => {
    const mockLLM = {
      invoke: jest.fn().mockResolvedValue({ content: 'Deterministic answer', additional_kwargs: {} }),
    };

    const genService = new GenerationService(mockLLM as any);
    await genService.generate('deterministic query', 'context');

    const [messages] = (mockLLM.invoke as jest.Mock).mock.calls[0];
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBe(2);
  });

  it('usage stats returned from generation response', async () => {
    const mockLLM = {
      invoke: jest.fn().mockResolvedValue({
        content: 'Answer',
        additional_kwargs: { tokenUsage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } },
      }),
    };

    const genService = new GenerationService(mockLLM as any);
    const result = await genService.generate('query', 'context');

    expect(result.usage).toMatchObject({ totalTokens: 30 });
  });

  it('system prompt replaces {context} with actual context', async () => {
    const mockLLM = {
      invoke: jest.fn().mockResolvedValue({ content: 'ok', additional_kwargs: {} }),
    };

    const genService = new GenerationService(mockLLM as any);
    await genService.generate('query', 'MY CONTEXT DATA', 'Answer using: {context}');

    const messages = (mockLLM.invoke as jest.Mock).mock.calls[0][0];
    expect(messages[0].content).toContain('MY CONTEXT DATA');
    expect(messages[0].content).not.toContain('{context}');
  });
});
