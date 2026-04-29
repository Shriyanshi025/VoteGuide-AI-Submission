
/**
 * Service to handle browser notifications and vote day reminders.
 */

export interface VoterReminder {
  id: string;
  title: string;
  date: string;
  type: 'once' | 'recurring';
  notified?: boolean;
}

class ReminderService {
  private STORAGE_KEY = 'voteguide_reminders';

  constructor() {
    this.init();
  }

  private init() {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        // We will request on first interaction
      }
    }
    this.checkDueReminders();
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  getReminders(): VoterReminder[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  addReminder(title: string, daysBefore: number) {
    const reminders = this.getReminders();
    const electionDate = new Date('2026-06-01T08:00:00');
    // For test purposes (0 days = 10 seconds from now)
    const reminderDate = daysBefore === 0 
      ? new Date(Date.now() + 10000) 
      : new Date(electionDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
    
    const newReminder: VoterReminder = {
      id: Date.now().toString(),
      title: `Reminder: ${title}`,
      date: reminderDate.toISOString(),
      type: 'once',
      notified: false
    };

    reminders.push(newReminder);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
    
    // Check if it's immediately due (e.g., negative days)
    this.checkDueReminders();
  }

  checkDueReminders() {
    const reminders = this.getReminders();
    const now = Date.now();
    let updated = false;

    reminders.forEach(reminder => {
      if (!reminder.notified) {
        const target = new Date(reminder.date).getTime();
        if (now >= target) {
          this.showNotification(reminder.title);
          reminder.notified = true;
          updated = true;
        } else {
          // If it's a test reminder (within a minute), schedule a short timeout
          const delay = target - now;
          if (delay > 0 && delay < 60000) {
            setTimeout(() => {
              this.showNotification(reminder.title);
              reminder.notified = true;
              localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.getReminders().map(r => r.id === reminder.id ? { ...r, notified: true } : r)));
            }, delay);
          }
        }
      }
    });

    if (updated) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
    }
  }

  showNotification(message: string) {
    if (Notification.permission === 'granted') {
      new Notification('VoteGuide AI', {
        body: message,
        icon: '/vite.svg',
        tag: 'voteguide-reminder'
      });
    }
  }

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const reminderService = new ReminderService();
