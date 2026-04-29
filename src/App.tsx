import React from 'react';
import { AppShell } from './components/common/AppShell';
import { HomeView, ChatView, JourneyView, ToolsView, SettingsView } from './views';
import './styles/global.css';

import { useUIStore } from './store/useUIStore';

const App: React.FC = () => {
  const theme = useUIStore((state) => state.theme);
  const fontScale = useUIStore((state) => state.fontScale);
  const simpleMode = useUIStore((state) => state.simpleMode);
  const currentView = useUIStore((state) => state.currentView);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-simple', simpleMode.toString());
  }, [simpleMode]);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'chat': return <ChatView />;
      case 'journey': return <JourneyView />;
      case 'tools': return <ToolsView />;
      case 'settings': return <SettingsView />;
      default: return <HomeView />;
    }
  };

  return (
    <AppShell>
      {renderView()}
    </AppShell>
  );
};

export default App;
