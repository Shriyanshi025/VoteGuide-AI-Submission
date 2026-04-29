import { describe, it, expect, beforeEach } from 'vitest';
import { reminderService } from '../services/reminderService';

describe('Reminder Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store a reminder in localStorage', () => {
    reminderService.addReminder('Check Registration', 30);
    const reminders = reminderService.getReminders();
    expect(reminders.length).toBe(1);
    expect(reminders[0].title).toContain('Check Registration');
  });

  it('should clear all reminders from localStorage', () => {
    reminderService.addReminder('Test', 1);
    reminderService.clearAll();
    expect(reminderService.getReminders().length).toBe(0);
  });

  it('should not crash when checking due reminders with no reminders', () => {
    expect(() => reminderService.checkDueReminders()).not.toThrow();
  });
});
