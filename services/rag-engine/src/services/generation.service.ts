import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export class GenerationService {
  constructor(private llm: BaseChatModel) {}

  async generate(query: string, context: string, systemPrompt?: string) {
    const defaultSystemPrompt = `You are a helpful AI assistant. Use the following context to answer the user's question. 
If the answer is not in the context, say that you don't know. 
Do not make up information.

Context:
{context}`;

    const prompt = (systemPrompt || defaultSystemPrompt).replace('{context}', context);

    const response = await this.llm.invoke([
      new SystemMessage(prompt),
      new HumanMessage(query),
    ]);

    return {
      content: response.content,
      usage: response.additional_kwargs?.tokenUsage || {},
    };
  }
}
