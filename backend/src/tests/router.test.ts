import { describe, it, expect } from 'vitest';
import { getLocalElectionAnswer } from '../services/localIntentRouter';

describe('Local Intent Router', () => {
  it('should detect eligibility intent', () => {
    expect(getLocalElectionAnswer('What is Eligibility')).toContain('18 years old');
    expect(getLocalElectionAnswer('Can I vote?')).toContain('Indian citizen');
  });

  it('should detect registration intent', () => {
    expect(getLocalElectionAnswer('How to register?')).toContain('Form 6');
  });

  it('should detect documents intent', () => {
    expect(getLocalElectionAnswer('What documents are required?')).toContain('Proof of Identity');
  });

  it('should detect voter ID help intent', () => {
    expect(getLocalElectionAnswer('I lost my voter card')).toContain('Form 8');
  });

  it('should detect election dates intent', () => {
    expect(getLocalElectionAnswer('When is election?')).toContain('official Election Commission');
  });

  it('should detect booth intent', () => {
    expect(getLocalElectionAnswer('Where do I vote?')).toContain('polling booth');
  });

  it('should detect voting process intent', () => {
    expect(getLocalElectionAnswer('How to vote on election day?')).toContain('EVM');
  });

  it('should detect accessibility support intent', () => {
    expect(getLocalElectionAnswer('wheelchair assistance')).toContain('Saksham App');
  });

  it('should detect general help intent', () => {
    expect(getLocalElectionAnswer('How election works?')).toContain('Indian election process');
  });

  it('should return null for non-election queries', () => {
    expect(getLocalElectionAnswer('Tell me a joke')).toBeNull();
    expect(getLocalElectionAnswer('Hello')).toBeNull();
  });
});
