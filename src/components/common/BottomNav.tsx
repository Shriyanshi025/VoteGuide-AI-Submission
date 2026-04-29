import React from 'react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'journey', label: 'Journey', icon: '🗺️' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav style={{
      height: 'var(--nav-height)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100
    }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: currentView === item.id ? 'var(--primary)' : 'var(--text-muted)',
            opacity: currentView === item.id ? 1 : 0.7
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
