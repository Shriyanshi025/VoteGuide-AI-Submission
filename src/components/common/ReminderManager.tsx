import React, { useState, useEffect } from 'react';

export const ReminderManager: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [status, setStatus] = useState<'disabled' | 'enabled'>('disabled');
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("voteReminder");
    if (saved) {
      const data = JSON.parse(saved);
      setDays(data.days);
      setStatus('enabled');
    }
  }, []);

  const setReminder = (d: number) => {
    localStorage.setItem("voteReminder", JSON.stringify({ days: d }));
    setDays(d);
    setShowOptions(false);
    setStatus("enabled");
  };

  const disableReminder = () => {
    localStorage.removeItem("voteReminder");
    setStatus("disabled");
  };

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
      <h3>Election Reminders</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
        Never miss your chance to vote. Set a reminder for the upcoming election.
      </p>

      {status === "enabled" && (
        <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: 'var(--space-sm)', fontWeight: 'bold' }}>
          ✅ Reminder Enabled (set for {days} days before)
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {status === 'disabled' && !showOptions && (
          <button className="cta-button" onClick={() => setShowOptions(true)} style={{ width: '100%' }}>
            🔔 Enable Reminder
          </button>
        )}

        {showOptions && (
          <div className="reminder-options" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-sm)' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Select Reminder Time:</p>
            <button className="card" onClick={() => setReminder(1)}>1 day before</button>
            <button className="card" onClick={() => setReminder(3)}>3 days before</button>
            <button className="card" onClick={() => setReminder(7)}>1 week before</button>
            <button className="secondary-button" onClick={() => setShowOptions(false)}>Cancel</button>
          </div>
        )}

        {status === 'enabled' && (
          <button 
            className="secondary-button" 
            onClick={disableReminder}
            style={{ width: '100%', borderColor: 'red', color: 'red' }}
          >
            Disable Reminder
          </button>
        )}
      </div>
    </div>
  );
};
