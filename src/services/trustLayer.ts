import rulesData from '../config/rules.json';
import type { RuleKnowledgeBase, Attribution, RoadmapData } from '../types';

const kb = rulesData as RuleKnowledgeBase;

const TOPIC_MAP: Record<string, string[]> = {
  submit_documents: ['provide documents', 'submit documents', 'upload documents', 'where submit', 'where upload', 'how to submit', 'where can i provide'],
  required_documents: ['documents needed', 'which documents', 'what id', 'proof', 'list of documents'],
  update_documents: ['update', 'change', 'modify', 'correction', 'edit documents'],
  eligibility: ['eligible', 'age', '18', 'citizen', 'can i vote', 'qualification'],
  registration: ['register', 'form', 'enroll', 'new voter', 'form 6', 'form 8'],
  verification: ['list', 'verify', 'check name', 'electoral roll', 'nvsp'],
  polling_booth: ['booth', 'station', 'where to vote', 'part number', 'location'],
  voting_process: ['process', 'how to vote', 'evm', 'vvpat', 'ink', 'finger', 'machine'],
  results: ['result', 'count', 'who won', 'live result', 'winner']
};

/**
 * Normalizes input keywords using a strict mapping logic.
 */
const normalizeTopic = (query: string): string | null => {
  const q = query.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(TOPIC_MAP)) {
    if (keywords.some(keyword => q.includes(keyword))) {
      return topic;
    }
  }
  
  return null;
};

/**
 * Retrieves a structured attribution with priority lookup.
 */
export const getAttribution = (query: string): Attribution | null => {
  const q = query.toLowerCase();

  // 1. FAQ Priority (Deep Search)
  const faq = kb.schema.faqs.find(f => 
    q.includes(f.q.toLowerCase()) || 
    f.q.toLowerCase().includes(q)
  );
  if (faq) {
    return {
      answer: faq.a,
      attribution: faq.source,
      verified: true
    };
  }

  // 2. Common Misconceptions Priority
  const misconception = kb.schema.common_misconceptions.find(m => q.includes(m.myth.toLowerCase()));
  if (misconception) {
    return {
      answer: misconception.fact,
      attribution: misconception.source,
      verified: true
    };
  }

  // 3. Roadmap Logic (Intent Mapping)
  const topicKey = normalizeTopic(query);
  if (topicKey) {
    const roadmap: Record<string, RoadmapData> = kb.schema.roadmap;
    
    // Check for exact match in roadmap keys first
    if (roadmap[topicKey]) {
      const data = roadmap[topicKey];
      return {
        answer: `${data.title}: ${data.rules.join('\n')}`, // JOIN WITH NEWLINE
        attribution: data.source,
        verified: true
      };
    }

    // Fallback mappings
    let finalKey = topicKey;
    if (['required_documents', 'update_documents'].includes(topicKey)) {
      finalKey = 'documents';
    } else if (topicKey === 'polling_booth') {
      finalKey = 'booth';
    } else if (topicKey === 'voting_process') {
      finalKey = 'vote';
    }

    const data = roadmap[finalKey];
    if (data) {
      return {
        answer: `${data.title}: ${data.rules.join('\n')}`, // JOIN WITH NEWLINE
        attribution: data.source,
        verified: true
      };
    }
  }

  return null;
};
