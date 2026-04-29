import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';

describe('Persona Styles', () => {
  it('should provide detailed guidance for first-time voters', async () => {
    const response = await getAIResponse('eligible', 'first-time', 'simple', [], 'English');
    expect(response.answer).toContain('Welcome to your first election');
    expect(response.answer).toContain('step-by-step');
  });

  it('should provide concise guidance for busy professionals', async () => {
    const response = await getAIResponse('eligible', 'busy', 'simple', [], 'English');
    expect(response.answer).toContain('keep it brief');
    // Busy persona strips non-bullet lines in explanationModeService
    expect(response.answer).not.toContain('Welcome to your first election');
  });

  it('should provide simple/reassuring guidance for senior citizens', async () => {
    const response = await getAIResponse('eligible', 'elderly', 'simple', [], 'English');
    expect(response.answer).toContain('Don\'t worry');
    expect(response.answer).toContain('assist you');
  });

  it('should mention accessibility for the accessibility persona', async () => {
    const response = await getAIResponse('eligible', 'accessibility', 'simple', [], 'English');
    expect(response.answer).toContain('accessible guide');
    expect(response.answer).toContain('♿ Accessibility Note');
  });

  it('should differentiate between detailed and concise modes for the same persona', async () => {
    const detailed = await getAIResponse('eligible', 'first-time', 'detailed', [], 'English');
    const concise = await getAIResponse('eligible', 'first-time', 'concise', [], 'English');
    expect(detailed.answer.length).toBeGreaterThan(concise.answer.length);
  });
});
