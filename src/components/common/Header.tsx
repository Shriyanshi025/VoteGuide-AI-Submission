import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { APP_NAME } from '../../utils/constants';

export const Header: React.FC = () => {
  const { theme, setTheme, fontScale, setFontScale } = useUIStore();

  return (
    <header style={{
      height: 'var(--header-height)',
      padding: '0 var(--space-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{APP_NAME}</h1>
      
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
        <button 
          onClick={() => setFontScale(fontScale === 1 ? 1.2 : 1)}
          aria-label="Toggle font scale"
        >
          {fontScale === 1 ? 'A+' : 'A-'}
        </button>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};
