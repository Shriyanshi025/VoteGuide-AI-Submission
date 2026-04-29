import { describe, it, expect } from 'vitest';
import { formatResponse } from '../services/explanationModeService';

describe('Formatting & Explanation Modes', () => {
  const content = "✅ Voter Eligibility\n────────\n• Must be 18+\n• Must be Indian Citizen\n────────\nMore details follow here.";

  it('should simplify terminology in simple mode', () => {
    const raw = "Visit your Constituency for EPIC verification.";
    const formatted = formatResponse(raw, 'simple', 'first-time');
    expect(formatted).toContain('Voting Area');
    expect(formatted).toContain('Voter ID Card');
  });

  it('should return only first section in concise mode', () => {
    // Accessibility persona adds a suffix, so the prefix-based truncation works better for the main content
    const formatted = formatResponse(content, 'concise', 'accessibility');
    expect(formatted).toContain('Voter Eligibility');
    expect(formatted).not.toContain('More details');
  });

  it('should return full content in detailed mode', () => {
    const formatted = formatResponse(content, 'detailed', 'first-time');
    expect(formatted).toContain('Voter Eligibility');
    expect(formatted).toContain('More details');
  });

  it('should preserve bullet points', () => {
    const formatted = formatResponse(content, 'simple', 'first-time');
    expect(formatted).toContain('•');
  });

  it('should truncate extremely long responses based on config', () => {
    const longContent = "A".repeat(5000);
    const formatted = formatResponse(longContent, 'concise', 'first-time');
    expect(formatted.length).toBeLessThanOrEqual(1003); // 1000 + "..."
  });
});
