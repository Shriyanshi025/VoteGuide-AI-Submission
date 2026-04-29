import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

console.log('[VoteGuide] Entry point main.tsx executed');

// Kill any existing Service Worker to prevent cache-related White Screen of Death
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(() => {
        console.log('[VoteGuide] ServiceWorker unregistered successfully');
        // Force reload only if we found a registration to clear, to ensure clean state
        window.location.reload();
      });
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('[VoteGuide] Root element found, mounting app...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('[VoteGuide] Render call completed');
} else {
  console.error('[VoteGuide] FAILED: Root element not found');
}
