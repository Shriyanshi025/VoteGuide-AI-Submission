import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';

describe('Quick Actions', () => {
  it('should return all 7 quick actions for a greeting', async () => {
    const response = await getAIResponse('Hi', 'first-time', 'simple', []);
    const expectedActions = [
      'Check Eligibility',
      'Find Polling Booth',
      'Register to Vote',
      'Required Documents',
      'Voter ID Help',
      'Election Dates',
      'Other Question'
    ];
    
    expect(response.suggestions).toEqual(expect.arrayContaining(expectedActions));
    expect(response.suggestions?.length).toBe(7);
  });
});
