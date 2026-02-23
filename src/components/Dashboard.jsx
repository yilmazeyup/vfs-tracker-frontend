import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import OfficeSelector from './OfficeSelector';
import CountrySelector from './CountrySelector';
import NotificationSettings from './NotificationSettings';
import CredentialsForm from './CredentialsForm';
import './Dashboard.css';

const Dashboard = ({ monitoring, setMonitoring, preferences, setPreferences }) => {
  const [stats, setStats] = useState({
    totalScans: 0,
    lastScan: null,
    appointmentsFound: 0,
    activeOffices: [],
    errors: 0,
    successRate: 100
  });
  
  // Use preferences from props if available, otherwise use defaults
  const { selectedCountry, selectedOffices, scanInterval, notifications } = preferences || {};
  
  // Ensure we have valid defaults and arrays
  const safeSelectedCountry = selectedCountry || 'netherlands';
  const safeSelectedOffices = Array.isArray(selectedOffices) ? selectedOffices : [];
  const safeScanInterval = scanInterval || 300;
  const safeNotifications = notifications || { telegram: true, email: false, sound: true };
  
  const [activities, setActivities] = useState([]);
  const [credentials, setCredentials] = useState({
    email: localStorage.getItem('vfsEmail') || '',
    password: localStorage.getItem('vfsPassword') || ''
  });
  const soundRef = useRef(null);
  
  // Helper functions to update preferences
  const setSelectedCountry = (value) => setPreferences(prev => ({ ...prev, selectedCountry: value }));
  const setSelectedOffices = (value) => setPreferences(prev => ({ ...prev, selectedOffices: Array.isArray(value) ? value : [] }));
  const setScanInterval = (value) => setPreferences(prev => ({ ...prev, scanInterval: value }));
  const setNotifications = (value) => setPreferences(prev => ({ ...prev, notifications: value }));

  const countries = {
    netherlands: { 
      name: '🇳🇱 Hollanda', 
      offices: ['Ankara', 'Antalya', 'Bursa', 'Edirne', 'Gaziantep', 'İstanbul (Altunizade)', 'İstanbul (Beyoğlu)', 'İzmir'] 
    },
    germany: { name: '🇩🇪 Almanya', offices: ['Ankara', 'İstanbul', 'İzmir'] },
    italy: { name: '🇮🇹 İtalya', offices: ['Ankara', 'İstanbul'] },
    norway: { name: '🇳🇴 Norveç', offices: ['Ankara'] },
    canada: { name: '🇨🇦 Kanada', offices: ['Ankara', 'İstanbul'] }
  };

  const addActivity = (type, message, details = null) => {
    const newActivity = {
      id: Date.now(),
      type, // 'success', 'error', 'warning', 'info', 'appointment'
      message,
      details,
      time: new Date().toLocaleTimeString('tr-TR'),
      timestamp: Date.now()
    };
    
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  const startMonitoring = async () => {
    if (safeSelectedOffices.length === 0) {
      toast.error('Lütfen en az bir ofis seçin!');
      return;
    }

    if (!credentials.email || !credentials.password) {
      toast.error('VFS hesap bilgilerinizi ayarlardan girin!');
      return;
    }

    setMonitoring(true);
    toast.success('🚀 VFS taraması başlatıldı!');
    addActivity('info', '🚀 Tarama başlatıldı', `${safeSelectedOffices.length} ofis taranıyor`);
    
    // Simulate scanning activity
    const simulateScanning = () => {
      if (!monitoring) return;
      
      const scenarios = [
        { type: 'success', chance: 0.7 },
        { type: 'error', chance: 0.2 },
        { type: 'warning', chance: 0.08 },
        { type: 'appointment', chance: 0.02 }
      ];

      const random = Math.random();
      let currentChance = 0;
      
      for (const scenario of scenarios) {
        currentChance += scenario.chance;
        if (random <= currentChance) {
          if (scenario.type === 'success') {
            const office = safeSelectedOffices[Math.floor(Math.random() * safeSelectedOffices.length)];
            addActivity('success', `✅ ${office} taraması tamamlandı`, 'Randevu bulunamadı');
          } else if (scenario.type === 'error') {
            const errors = [
              'Bağlantı hatası',
              'Kimlik doğrulama hatası', 
              'Rate limit aşıldı',
              'Sayfa yüklenemedi'
            ];
            const error = errors[Math.floor(Math.random() * errors.length)];
            addActivity('error', `❌ ${error}`, 'VFS sistem hatası');
            setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
          } else if (scenario.type === 'appointment') {
            const office = safeSelectedOffices[Math.floor(Math.random() * safeSelectedOffices.length)];
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
            
            addActivity('appointment', `🎉 RANDEVU BULUNDU! ${office}`, 
              `Tarih: ${date.toLocaleDateString('tr-TR')} - Hemen rezerve edin!`);
            toast.success(`🎉 ${office} ofisinde randevu bulundu!`, { autoClose: false });
            setStats(prev => ({ ...prev, appointmentsFound: prev.appointmentsFound + 1 }));
          }
          break;
        }
      }
      
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        lastScan: new Date().toLocaleTimeString('tr-TR')
      }));

      setTimeout(simulateScanning, safeScanInterval * 1000);
    };
    
    setTimeout(simulateScanning, 2000);
  };

  const stopMonitoring = () => {
    setMonitoring(false);
    toast.info('⏹️ Tarama durduruldu');
    addActivity('info', '⏹️ Tarama durduruldu', 'Kullanıcı tarafından sonlandırıldı');
  };

  const handleOfficeToggle = (office) => {
    setSelectedOffices(prev => {
      const currentOffices = Array.isArray(prev) ? prev : [];
      return currentOffices.includes(office) 
        ? currentOffices.filter(o => o !== office)
        : [...currentOffices, office];
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>VFS Global Randevu Takip Sistemi</h1>
        <p className="subtitle">⚡ Manaliza Enterprise Solutions</p>
      </div>

      {/* Credentials Form */}
      <CredentialsForm 
        credentials={credentials} 
        setCredentials={setCredentials} 
      />
      
      {/* Notification Settings */}
      <NotificationSettings 
        notifications={safeNotifications} 
        setNotifications={setNotifications} 
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>{stats.totalScans}</h3>
            <p>Toplam Tarama</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.lastScan || '--:--'}</h3>
            <p>Son Tarama</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.appointmentsFound}</h3>
            <p>Bulunan Randevu</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{safeSelectedOffices.length}</h3>
            <p>Aktif Ofis</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.errors}</h3>
            <p>Toplam Hata</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{Math.round(((stats.totalScans - stats.errors) / Math.max(stats.totalScans, 1)) * 100)}%</h3>
            <p>Başarı Oranı</p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel card">
        <h2>Tarama Ayarları</h2>
        
        <CountrySelector
          selectedCountry={safeSelectedCountry}
          onCountrySelect={(country) => {
            setSelectedCountry(country);
            setSelectedOffices([]);
          }}
          countries={countries}
        />

        <div className="control-group">
          <label>Ofis Seçimi</label>
          <OfficeSelector
            selectedOffices={safeSelectedOffices}
            onOfficeToggle={handleOfficeToggle}
            offices={countries[safeSelectedCountry].offices}
          />
        </div>

        <div className="control-group">
          <label>Tarama Aralığı (saniye)</label>
          <input
            type="number"
            value={safeScanInterval}
            onChange={(e) => setScanInterval(parseInt(e.target.value))}
            min="60"
            max="3600"
            className="input-field"
          />
        </div>

        <div className="control-actions">
          {!monitoring ? (
            <button 
              onClick={startMonitoring} 
              className="btn btn-primary"
              disabled={!credentials.email || !credentials.password}
            >
              🚀 Taramayı Başlat
            </button>
          ) : (
            <button onClick={stopMonitoring} className="btn btn-danger">
              ⏹️ Taramayı Durdur
            </button>
          )}
        </div>
      </div>

      {/* Live Status */}
      {monitoring && (
        <div className="live-status card">
          <div className="live-header">
            <h2>🔴 Canlı Tarama</h2>
            <span className="pulse"></span>
          </div>
          <div className="scanning-animation">
            <div className="scanner"></div>
            <p>Randevular taranıyor...</p>
          </div>
          <div className="scanning-offices">
            {safeSelectedOffices.map(office => (
              <div key={office} className="office-status">
                <span className="office-name">{office}</span>
                <span className="status-active">● Aktif</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="activity-log card">
        <h2>Son Aktiviteler</h2>
        {activities.length === 0 ? (
          <div className="no-activity">
            <p>Henüz aktivite yok. Taramayı başlatın.</p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <span className="activity-time">{activity.time}</span>
                <div className="activity-content">
                  <span className="activity-text">{activity.message}</span>
                  {activity.details && (
                    <span className="activity-details">{activity.details}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;