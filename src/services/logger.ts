/**
 * Lightweight logging service for tracking errors and critical events locally.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
}

const MAX_LOGS = 50;
let logBuffer: LogEntry[] = [];

export const log = (level: LogLevel, message: string, data?: any) => {
  const entry: LogEntry = {
    level,
    message,
    timestamp: Date.now(),
    data
  };

  logBuffer.push(entry);
  if (logBuffer.length > MAX_LOGS) logBuffer.shift();

  // Also log to console in development
  if (import.meta.env.DEV) {
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[VoteGuide ${level.toUpperCase()}] ${message}`, data || '');
  }
};

export const getLogs = () => [...logBuffer];

export const clearLogs = () => {
  logBuffer = [];
};
