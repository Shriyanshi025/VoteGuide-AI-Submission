import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';

describe('Guardrails', () => {
  it('should redirect off-topic queries like jokes', async () => {
    const response = await getAIResponse('tell me a joke', 'first-time', 'simple', []);
    expect(response.answer).toContain('I’m VoteGuide AI and I can help only with Indian voter guidance');
    expect(response.attribution).toBe('Local Guardrail');
  });

  it('should redirect off-topic queries like weather', async () => {
    const response = await getAIResponse('weather today', 'first-time', 'simple', []);
    expect(response.answer).toContain('I’m VoteGuide AI and I can help only with Indian voter guidance');
    expect(response.attribution).toBe('Local Guardrail');
  });

  it('should not throw error for normal queries', async () => {
    const response = await getAIResponse('voter id', 'busy', 'simple', []);
    expect(response).toBeDefined();
    expect(response.answer).toBeDefined();
  });
});
