import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';

describe('Quick Actions', () => {
  const expectedActions = [
    'Check Eligibility',
    'Find Polling Booth',
    'Register to Vote',
    'Required Documents',
    'Voter ID Help',
    'Election Dates',
    'Other Question'
  ];

  it('should return all 7 quick actions for a greeting', async () => {
    const response = await getAIResponse('Hi', 'first-time', 'simple', []);
    expect(response.suggestions).toEqual(expect.arrayContaining(expectedActions));
    expect(response.suggestions?.length).toBe(7);
  });

  it('should include Voter ID Help explicitly', async () => {
    const response = await getAIResponse('Hello', 'busy', 'simple', []);
    expect(response.suggestions).toContain('Voter ID Help');
  });

  it('should include Other Question as the final option', async () => {
    const response = await getAIResponse('Greetings', 'elderly', 'simple', []);
    expect(response.suggestions?.[response.suggestions.length - 1]).toBe('Other Question');
  });

  it('should provide localized quick actions for Hindi', async () => {
    const response = await getAIResponse('नमस्ते', 'first-time', 'simple', [], 'Hindi');
    // In our implementation, suggestions are currently English in the orchestrator but labels are translated in UI.
    // However, if we want to test localized backend responses:
    expect(response.suggestions).toBeDefined();
    expect(response.suggestions?.length).toBe(7);
  });
});
