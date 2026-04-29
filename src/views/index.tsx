import React from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Roadmap } from '../components/journey/Roadmap';
import { ReadinessCard } from '../components/journey/ReadinessCard';
import { BoothFinder } from '../components/map/BoothFinder';
import { VotingSimulator } from '../components/simulator/VotingSimulator';
import { ReminderManager } from '../components/common/ReminderManager';
import { translations } from '../i18n/translations';
import { useUIStore } from '../store/useUIStore';
import { useJourneyStore } from '../store/useJourneyStore';
import { calculateReadiness } from '../services/readinessEngine';
import { getPersonaConfig } from '../services/personaService';
import { PERSONAS } from '../utils/constants';
import type { AppLanguage, ExplanationMode, PersonaType } from '../types';

export const HomeView: React.FC = () => {
  const persona = useUIStore(state => state.persona);
  const config = getPersonaConfig(persona);
  const readiness = useJourneyStore(state => state.readiness);
  const setCurrentView = useUIStore(state => state.setCurrentView);
  const summary = calculateReadiness(readiness);

  return (
    <div className="view">
      <h1>Namaste!</h1>
      <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: 'var(--space-md)' }}>{config.greeting}</p>
      
      <ReadinessCard />

      {summary.missing.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--space-md)' }}>
          <h3>Remaining Tasks</h3>
          <ul style={{ paddingLeft: 'var(--space-md)', fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>
            {summary.missing.map(task => (
              <li key={task} style={{ marginBottom: 'var(--space-xs)' }}>{task}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)', flexDirection: 'column' }}>
        <button 
          className="cta-button" 
          style={{ padding: 'var(--space-md)' }}
          onClick={() => setCurrentView('journey')}
        >
          {summary.nextAction} ➡️
        </button>
      </div>
    </div>
  );
};

export const ChatView: React.FC = () => (
  <div className="view">
    <ChatWindow />
  </div>
);

export const JourneyView: React.FC = () => (
  <div className="view">
    <h1>Your Election Journey</h1>
    <ReadinessCard />
    <div style={{ height: 'var(--space-md)' }} />
    <Roadmap />
  </div>
);

export const ToolsView: React.FC = () => (
  <div className="view">
    <h1>Utility Tools</h1>
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <h2>📍 Polling Booth Finder</h2>
      <BoothFinder />
    </div>
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <h2>🗳️ Voting Simulator</h2>
      <VotingSimulator />
    </div>
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <ReminderManager />
    </div>
  </div>
);

export const SettingsView: React.FC = () => {
  const { 
    persona, setPersona, 
    explanationMode, setExplanationMode, 
    theme, setTheme, 
    language, setLanguage,
    fontScale, setFontScale,
    simpleMode, toggleSimpleMode,
    voiceEnabled, toggleVoiceEnabled
  } = useUIStore();

  const t = translations[language];

  return (
    <div className="view">
      <h1>{t['settings.title']}</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <section>
          <label>{t['settings.persona']}</label>
          <select value={persona} onChange={(e) => setPersona(e.target.value as PersonaType)} className="text-input" style={{ width: '100%' }}>
            {Object.entries(PERSONAS).map(([id, p]) => (
              <option key={id} value={id}>{p.label}</option>
            ))}
          </select>
        </section>

        <section>
          <label>{t['settings.explanation']}</label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
            {(['simple', 'concise', 'detailed'] as ExplanationMode[]).map(mode => (
              <button 
                key={mode}
                onClick={() => setExplanationMode(mode)}
                className="card"
                style={{ 
                  flex: 1, 
                  padding: 'var(--space-sm)', 
                  borderColor: explanationMode === mode ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: explanationMode === mode ? 'var(--primary-light)' : 'var(--bg-card)'
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label>{t['settings.language']}</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value as AppLanguage)} className="text-input" style={{ width: '100%' }}>
            {['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu'].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </section>

        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>{theme === 'light' ? t['settings.dark_mode_off'] : t['settings.dark_mode_on']}</label>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ fontSize: '1.5rem' }}>
            {theme === 'light' ? '🌑' : '☀️'}
          </button>
        </section>

        <section>
          <label>{t['settings.font_scale']} ({fontScale}x)</label>
          <input 
            type="range" min="1" max="1.5" step="0.1" 
            value={fontScale} 
            onChange={(e) => setFontScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </section>

        <section style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label>{t['settings.simple_mode']}</label>
          <button onClick={toggleSimpleMode} style={{ color: simpleMode ? 'var(--secondary)' : 'var(--text-muted)' }}>
            {simpleMode ? t['settings.on'] : t['settings.off']}
          </button>
        </section>

        <section style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label>{t['settings.voice_feedback']}</label>
          <button onClick={toggleVoiceEnabled} style={{ color: voiceEnabled ? 'var(--secondary)' : 'var(--text-muted)' }}>
            {voiceEnabled ? t['settings.on'] : t['settings.off']}
          </button>
        </section>
      </div>
    </div>
  );
};
