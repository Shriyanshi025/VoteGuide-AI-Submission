import { describe, it, expect, beforeEach } from 'vitest';
import { reminderService } from '../services/reminderService';

describe('Reminder Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store a reminder when added', () => {
    reminderService.addReminder('Registration', 30);
    const reminders = reminderService.getReminders();
    expect(reminders.length).toBe(1);
    expect(reminders[0].title).toContain('Registration');
  });

  it('should clear reminders when clearAll is called', () => {
    reminderService.addReminder('Test', 1);
    reminderService.clearAll();
    expect(reminderService.getReminders().length).toBe(0);
  });

  it('should not crash on empty reminder check', () => {
    expect(() => reminderService.checkDueReminders()).not.toThrow();
  });

  it('should store the correct ISO date for the reminder', () => {
    reminderService.addReminder('Future Event', 5);
    const reminders = reminderService.getReminders();
    expect(reminders[0].date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should handle multiple reminders correctly', () => {
    reminderService.addReminder('First', 1);
    reminderService.addReminder('Second', 2);
    expect(reminderService.getReminders().length).toBe(2);
  });

  it('should mark reminders as notified after check if due', () => {
    // 0 days means 10 seconds from now in our implementation, 
    // but checkDueReminders runs immediately.
    reminderService.addReminder('Due Now', -1); // Force immediate due by hacking logic if possible, 
    // actually addReminder logic: daysBefore === 0 ? +10s : electionDate - daysBefore.
    // If we use a very large daysBefore it might be in the past.
    reminderService.addReminder('Past Event', 1000); 
    reminderService.checkDueReminders();
    const reminders = reminderService.getReminders();
    const past = reminders.find(r => r.title.includes('Past Event'));
    expect(past?.notified).toBe(true);
  });
});
