import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';

describe('Guardrails', () => {
  const blockMessage = 'I’m VoteGuide AI and I can help only with Indian voter guidance';

  it('should redirect joke requests', async () => {
    const response = await getAIResponse('tell me a joke', 'first-time', 'simple', []);
    expect(response.answer).toContain(blockMessage);
  });

  it('should redirect weather queries', async () => {
    const response = await getAIResponse('what is the weather', 'first-time', 'simple', []);
    expect(response.answer).toContain(blockMessage);
  });

  it('should redirect movie recommendations', async () => {
    const response = await getAIResponse('suggest a good movie', 'first-time', 'simple', []);
    expect(response.answer).toContain(blockMessage);
  });

  it('should redirect cricket/IPL queries', async () => {
    const response = await getAIResponse('who won the ipl match today', 'first-time', 'simple', []);
    expect(response.answer).toContain(blockMessage);
  });

  it('should redirect coding questions', async () => {
    const response = await getAIResponse('how to write a loop in python', 'first-time', 'simple', []);
    expect(response.answer).toContain(blockMessage);
  });

  it('should allow voter-related queries (registration)', async () => {
    const response = await getAIResponse('how to register', 'first-time', 'simple', []);
    expect(response.answer).not.toContain(blockMessage);
    expect(response.attribution).toBeDefined();
  });

  it('should allow voter-related queries (voter id)', async () => {
    const response = await getAIResponse('voter id status', 'first-time', 'simple', []);
    expect(response.answer).not.toContain(blockMessage);
  });
});
