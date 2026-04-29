import { Component, type ErrorInfo, type ReactNode } from 'react';
import { log } from '../../services/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log('error', 'UI Crash detected', { error: error.toString(), info: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', textAlign: 'center', padding: 'var(--space-xl)' }}>
          <h1>Something went wrong.</h1>
          <p style={{ opacity: 0.7 }}>We encountered a temporary issue. Please refresh the app.</p>
          <button 
            className="cta-button" 
            onClick={() => window.location.reload()}
            style={{ marginTop: 'var(--space-md)' }}
          >
            Refresh App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
