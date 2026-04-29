import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useUIStore } from '../../store/useUIStore';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const currentView = useUIStore(state => state.currentView);
  const setCurrentView = useUIStore(state => state.setCurrentView);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      paddingBottom: 'var(--nav-height)' 
    }}>
      <Header />
      <main style={{ flex: 1, padding: 'var(--space-md)' }}>
        {children}
      </main>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};
