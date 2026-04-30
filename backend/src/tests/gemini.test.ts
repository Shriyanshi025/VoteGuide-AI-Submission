import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceWithGemini } from '../services/geminiOptionalService';

// Mock the Google AI library
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn().mockReturnValue({
  generateContent: mockGenerateContent
});

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = mockGetGenerativeModel;
    }
  };
});

describe('Gemini Optional Service', () => {
  const params = {
    userQuery: 'How to register?',
    localAnswer: 'Visit voters.eci.gov.in',
    persona: 'Professional',
    language: 'English'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return null if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await enhanceWithGemini(params);
    expect(result).toBeNull();
  });

  it('should return null on Gemini error/failure', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Error'));
    const result = await enhanceWithGemini(params);
    expect(result).toBeNull();
  });

  it('should return enhanced text on success', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Enhanced: Visit the official portal.'
      }
    });

    const result = await enhanceWithGemini(params);
    expect(result).toBe('Enhanced: Visit the official portal.');
  });

  it('should return null on timeout (mocked)', async () => {
    // Mock generateContent to take longer than 3s
    mockGenerateContent.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 5000)));

    // Use fake timers to speed up
    vi.useFakeTimers();
    const promise = enhanceWithGemini(params);
    vi.advanceTimersByTime(3500);
    const result = await promise;
    expect(result).toBeNull();
    vi.useRealTimers();
  });
});
