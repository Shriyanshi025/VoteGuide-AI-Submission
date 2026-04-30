import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAIResponse } from '../services/aiOrchestrator';
import { chat as mockChat } from '../api/backendClient';

// Mock the backend client
vi.mock('../api/backendClient', () => ({
  chat: vi.fn()
}));

describe('Frontend AI Orchestrator', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return deterministic local answer for quick actions', async () => {
    // "eligibility" keyword triggers local trustLayer
    const response = await getAIResponse('Eligibility Check', 'busy', 'concise', []);
    expect(response.attribution).toBe('ECI Handbook 2024, Chapter 2');
    expect(mockChat).not.toHaveBeenCalled();
  });

  it('should call backend for unknown free-text election queries', async () => {
    (mockChat as any).mockResolvedValue({
      answer: 'Backend: You are eligible.',
      attribution: 'Gemini Enhanced',
      verified: true
    });

    // Use a query that won't be caught by the very aggressive local trustLayer keywords
    const response = await getAIResponse('specific assembly election requirements 2026', 'busy', 'concise', []);
    expect(response.answer).toBe('Backend: You are eligible.');
    expect(response.attribution).toBe('Gemini Enhanced');
    expect(mockChat).toHaveBeenCalled();
  });

  it('should fallback to local guardrail for off-topic even if backend fails', async () => {
    (mockChat as any).mockRejectedValue(new Error('Network Error'));

    const response = await getAIResponse('Tell me a joke', 'busy', 'concise', []);
    expect(response.answer).toContain('voter guidance');
    expect(response.attribution).toBe('Local Guardrail');
  });

  it('should fallback to generic local answer if backend fails for unknown query', async () => {
    (mockChat as any).mockRejectedValue(new Error('Network Error'));

    const response = await getAIResponse('Something completely random', 'busy', 'concise', []);
    expect(response.attribution).toBe('Local Knowledge Base');
  });
});
