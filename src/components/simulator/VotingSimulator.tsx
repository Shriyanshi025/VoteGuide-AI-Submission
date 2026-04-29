import React from 'react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { getStepInstruction, MOCK_CANDIDATES, canProceed, getCompletionMessage } from '../../services/simulatorEngine';
import { CandidateCard } from './CandidateCard';
import { VVPATSlip } from './VVPATSlip';
import { speak } from '../../api/speech';
import { useUIStore } from '../../store/useUIStore';

export const VotingSimulator: React.FC = () => {
  const store = useSimulatorStore();
  const language = useUIStore(state => state.language);
  
  const instruction = getStepInstruction(store.currentStep);
  const selectedCandidate = MOCK_CANDIDATES.find(c => c.id === store.selectedCandidate);

  const handleSpeak = () => {
    speak(instruction, language);
  };

  const renderContent = () => {
    switch (store.currentStep) {
      case 'verification':
        return (
          <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '4rem' }}>🪪</div>
            <p>{instruction}</p>
            <button className="cta-button" onClick={store.nextStep}>Officer Verified My ID</button>
          </div>
        );
      case 'ink':
        return (
          <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '4rem' }}>☝️</div>
            <p>{instruction}</p>
            <button 
              className="cta-button" 
              onClick={() => {
                store.nextStep();
                useSimulatorStore.setState({ hasInkMark: true });
              }}
            >
              Mark Finger & Continue
            </button>
          </div>
        );
      case 'evm':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p style={{ fontWeight: 'bold' }}>Select a candidate:</p>
            {MOCK_CANDIDATES.map(c => (
              <CandidateCard 
                key={c.id}
                {...c}
                selected={store.selectedCandidate === c.id}
                onSelect={() => store.selectCandidate(c.id)}
              />
            ))}
            <button 
              className="cta-button" 
              disabled={!canProceed('evm', store)}
              onClick={store.nextStep}
            >
              Vote
            </button>
          </div>
        );
      case 'confirm':
        return (
          <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <h2>Confirm Selection?</h2>
            {selectedCandidate && (
              <div className="card" style={{ width: '100%', margin: 'var(--space-md) 0' }}>
                <div style={{ fontSize: '2rem' }}>{selectedCandidate.symbol}</div>
                <div>{selectedCandidate.name}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-md)', width: '100%' }}>
              <button className="card" style={{ flex: 1 }} onClick={store.prevStep}>Back</button>
              <button className="cta-button" style={{ flex: 2 }} onClick={store.nextStep}>Confirm</button>
            </div>
          </div>
        );
      case 'vvpat':
        return selectedCandidate ? (
          <VVPATSlip candidate={selectedCandidate} onComplete={store.nextStep} />
        ) : null;
      case 'complete':
        return (
          <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '4rem' }}>🎉</div>
            <h2>Vote Recorded!</h2>
            <p style={{ opacity: 0.8 }}>{getCompletionMessage()}</p>
            <div className="card" style={{ fontSize: '0.8rem', textAlign: 'left', marginTop: 'var(--space-md)' }}>
              <strong>Did you know?</strong>
              <ul style={{ paddingLeft: 'var(--space-md)', marginTop: '8px' }}>
                <li>Your vote is 100% secret.</li>
                <li>VVPAT allows you to verify your selection visually.</li>
                <li>You can always choose NOTA if you don't like any candidate.</li>
              </ul>
            </div>
            <button className="cta-button" onClick={store.resetSimulation}>Restart Simulation</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="simulator-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>
          Step: {store.currentStep}
        </span>
        <button onClick={handleSpeak} style={{ fontSize: '1.2rem' }}>🔊</button>
      </div>
      
      {renderContent()}
    </div>
  );
};
