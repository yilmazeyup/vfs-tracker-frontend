import React from 'react';
import './NotificationSettings.css';

const NotificationSettings = ({ notifications, setNotifications }) => {
  const handleToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleEmailChange = (e) => {
    setNotifications(prev => ({
      ...prev,
      emailAddress: e.target.value
    }));
  };

  const handleVolumeChange = (e) => {
    setNotifications(prev => ({
      ...prev,
      volume: parseInt(e.target.value)
    }));
  };

  const testNotification = (type) => {
    if (type === 'sound') {
      // Test sound
      const audio = new Audio('/notification.mp3');
      audio.volume = (notifications.volume || 80) / 100;
      audio.play().catch(e => console.log('Sound test failed:', e));
    }
  };

  return (
    <div className="notification-settings card">
      <div className="notification-header">
        <div className="notification-icon">🔔</div>
        <h3>Bildirim Ayarları</h3>
      </div>
      
      <div className="notification-grid">
        {/* Telegram Notifications */}
        <div className={`notification-card ${notifications.telegram ? 'active' : ''}`}>
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">📱</span>
              <span>Telegram</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.telegram}
                onChange={() => handleToggle('telegram')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="card-description">
            Randevu bulunduğunda Telegram'a bildirim gönder
          </div>
        </div>

        {/* Email Notifications */}
        <div className={`notification-card ${notifications.email ? 'active' : ''}`}>
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">📧</span>
              <span>E-mail</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleToggle('email')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="card-description">
            E-mail ile bildirim al
          </div>
          {notifications.email && (
            <div className="notification-options">
              <input
                type="email"
                placeholder="E-mail adresiniz"
                value={notifications.emailAddress || ''}
                onChange={handleEmailChange}
                className="email-input"
              />
            </div>
          )}
        </div>

        {/* Sound Notifications */}
        <div className={`notification-card ${notifications.sound ? 'active' : ''}`}>
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🔊</span>
              <span>Ses</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.sound}
                onChange={() => handleToggle('sound')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="card-description">
            Ses bildirimi çal
          </div>
          {notifications.sound && (
            <div className="notification-options">
              <div className="volume-control">
                <span className="volume-label">🔈</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={notifications.volume || 80}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
                <span className="volume-label">{notifications.volume || 80}%</span>
              </div>
              <button
                onClick={() => testNotification('sound')}
                className="test-button"
              >
                Sesi Test Et
              </button>
            </div>
          )}
        </div>
      </div>
      
      {(notifications.telegram || notifications.email || notifications.sound) && (
        <div className="notification-preview">
          <div className="preview-header">
            <span>🎯</span>
            <span>Bildirim Önizleme</span>
          </div>
          <div className="preview-content">
            {notifications.telegram && "📱 Telegram bildirim gönderilecek\n"}
            {notifications.email && "📧 E-mail gönderilecek\n"}
            {notifications.sound && "🔊 Ses çalınacak"}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;