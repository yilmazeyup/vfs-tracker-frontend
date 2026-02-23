import React, { useState } from 'react';
import './CredentialsForm.css';

const CredentialsForm = ({ credentials, setCredentials }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validationStatus, setValidationStatus] = useState('unknown');

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCredentials(prev => ({ ...prev, email }));
    localStorage.setItem('vfsEmail', email);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setCredentials(prev => ({ ...prev, password }));
    localStorage.setItem('vfsPassword', password);
  };

  const validateCredentials = async () => {
    if (!credentials.email || !credentials.password) {
      setValidationStatus('invalid');
      return;
    }

    setValidationStatus('validating');
    
    // Simulate validation
    setTimeout(() => {
      setValidationStatus(Math.random() > 0.3 ? 'valid' : 'invalid');
    }, 2000);
  };

  return (
    <div className="credentials-section card">
      <div className="credentials-header">
        <div className="credentials-icon">🔐</div>
        <h3>VFS Global Hesap Bilgileri</h3>
      </div>
      
      <div className="credentials-form">
        <div className="form-group">
          <label>E-mail Adresi</label>
          <input
            type="email"
            value={credentials.email}
            onChange={handleEmailChange}
            placeholder="example@email.com"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Şifre</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="form-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
        </div>
      </div>

      <div className="credentials-status">
        <div className="status-indicator">
          <div className={`status-dot status-${validationStatus}`}></div>
          <span className={`status-${validationStatus}`}>
            {validationStatus === 'valid' && '✅ Geçerli hesap'}
            {validationStatus === 'invalid' && '❌ Geçersiz hesap'}
            {validationStatus === 'validating' && '⏳ Doğrulanıyor...'}
            {validationStatus === 'unknown' && '⚪ Henüz test edilmedi'}
          </span>
        </div>
        
        <button 
          onClick={validateCredentials}
          disabled={!credentials.email || !credentials.password || validationStatus === 'validating'}
          className="validate-btn"
        >
          {validationStatus === 'validating' ? 'Kontrol Ediliyor...' : 'Hesabı Doğrula'}
        </button>
      </div>
      
      <div className="credentials-help">
        <span className="help-icon">💡</span>
        <strong>Not:</strong> VFS Global hesap bilgilerinizi güvenli şekilde saklıyoruz. 
        Bu bilgiler sadece randevu kontrolü için kullanılır ve üçüncü taraflarla paylaşılmaz.
      </div>
    </div>
  );
};

export default CredentialsForm;