/**
 * Maps user queries to deterministic election-related intents and answers.
 */
export const getLocalElectionAnswer = (query: string, language: string = 'English'): string | null => {
  const q = query.toLowerCase();

  const intents = [
    {
      id: 'eligibility',
      keywords: ['eligibility', 'eligible', 'voter eligibility', 'what is eligibility', 'am i eligible', 'can i vote', 'who can vote', 'voting age', 'age requirement', 'voter criteria', 'eligibility criteria'],
      answer: "To be eligible to vote in India, you must be an Indian citizen, at least 18 years old on the qualifying date, and a resident of the polling area. You must also not be disqualified by any law."
    },
    {
      id: 'registration',
      keywords: ['register', 'registration', 'how to register', 'form 6', 'new voter', 'apply voter id', 'voter registration', 'enroll'],
      answer: "You can register to vote by filling out Form 6. This can be done online at voters.eci.gov.in, via the Voter Helpline App, or by visiting your local Booth Level Officer (BLO)."
    },
    {
      id: 'documents',
      keywords: ['documents', 'required documents', 'what documents', 'id proof', 'address proof', 'age proof', 'documents needed', 'what to carry'],
      answer: "Commonly required documents include Proof of Identity (Aadhaar, Passport), Proof of Address (Electricity bill, Bank passbook), and Proof of Age (Birth certificate, 10th Marksheet)."
    },
    {
      id: 'voter_id_help',
      keywords: ['voter id', 'voter card', 'epic', 'correction', 'address update', 'name correction', 'lost voter card', 'duplicate voter id', 'update details'],
      answer: "For Voter ID issues, use Form 8 for corrections or address updates. If you lost your card, you can apply for a replacement via the Voter Portal or at your nearest ERO office."
    },
    {
      id: 'election_dates',
      keywords: ['election date', 'election dates', 'voting date', 'when is election', 'election schedule', 'timeline', 'polling date', 'result date'],
      answer: "Election dates vary by constituency. Please check the official Election Commission of India (ECI) schedule or use the 'Know Your Candidate' app for your specific area's timeline."
    },
    {
      id: 'booth',
      keywords: ['booth', 'polling station', 'polling booth', 'where to vote', 'where do i vote', 'voting location', 'find booth', 'polling place'],
      answer: "You can find your polling booth using your EPIC number on the ECI Voter Search portal or via the 'Find Polling Booth' tool in this app which uses your current location."
    },
    {
      id: 'process',
      keywords: ['how to vote', 'voting process', 'evm', 'vvpat', 'what happens on voting day', 'election day steps'],
      answer: "On voting day, go to your booth, get your finger marked with ink, press the button on the EVM next to your candidate, and verify your choice on the VVPAT slip screen."
    },
    {
      id: 'accessibility',
      keywords: ['wheelchair', 'disabled voter', 'pwd voter', 'senior citizen help', 'accessible booth', 'assistance at booth'],
      answer: "ECI provides accessibility support including ramps, wheelchairs, and priority voting for PwD and senior citizens. You can request assistance via the Saksham App."
    },
    {
      id: 'general_help',
      keywords: ['election process', 'election steps', 'voter journey', 'how election works', 'election help'],
      answer: "The Indian election process involves registration, checking your name in the roll, finding your booth, and casting your vote using an EVM. We are here to guide you at every step!"
    }
  ];

  for (const intent of intents) {
    if (intent.keywords.some(kw => q.includes(kw))) {
      return intent.answer;
    }
  }

  return null;
};
