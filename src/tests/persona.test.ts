import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';

describe('Persona Styles', () => {
  it('should provide a detailed step-style response for first-time voters', async () => {
    // Using 'eligible' which is a mapped keyword in trustLayer.ts
    const response = await getAIResponse('eligible', 'first-time', 'simple', [], 'English');
    expect(response.answer).toContain('Welcome to your first election');
    expect(response.answer).toContain('Voter Eligibility');
  });

  it('should provide a concise response for busy professionals', async () => {
    const response = await getAIResponse('eligible', 'busy', 'simple', [], 'English');
    expect(response.answer).toContain('keep it brief');
    expect(response.answer).toContain('Voter Eligibility');
  });

  it('should provide a respectful response for senior citizens', async () => {
    const response = await getAIResponse('eligible', 'elderly', 'simple', [], 'English');
    expect(response.answer).toContain('assist you');
    expect(response.answer).toContain('Voter Eligibility');
  });

  it('should mention accessibility for accessibility-focused persona', async () => {
    const response = await getAIResponse('eligible', 'accessibility', 'simple', [], 'English');
    expect(response.answer).toContain('accessible guide');
    expect(response.answer).toContain('Voter Eligibility');
  });
});
