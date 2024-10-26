import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ref as databaseRef, update } from 'firebase/database';
import { database } from '../../config/firebaseConfig';
import { 
  Bell, 
  Volume2, 
  Monitor, 
  Shield, 
  Save,

} from 'lucide-react';
import './Settings.css';

function Settings() {
  const { userProfile, currentUser, setUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      gameInvites: userProfile?.settings?.notifications?.gameInvites ?? true,
      achievements: userProfile?.settings?.notifications?.achievements ?? true,
      rankings: userProfile?.settings?.notifications?.rankings ?? true,
      chat: userProfile?.settings?.notifications?.chat ?? true
    },
    audio: {
      master: userProfile?.settings?.audio?.master ?? 100,
      effects: userProfile?.settings?.audio?.effects ?? 100,
      music: userProfile?.settings?.audio?.music ?? 80,
      chat: userProfile?.settings?.audio?.chat ?? 100
    },
    display: {
      theme: userProfile?.settings?.display?.theme ?? 'light',
      animations: userProfile?.settings?.display?.animations ?? true,
      compactMode: userProfile?.settings?.display?.compactMode ?? false
    },
    privacy: {
      showOnline: userProfile?.settings?.privacy?.showOnline ?? true,
      allowInvites: userProfile?.settings?.privacy?.allowInvites ?? true,
      showStats: userProfile?.settings?.privacy?.showStats ?? true
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const userRef = databaseRef(database, `users/${currentUser.uid}/settings`);
      await update(userRef, settings);
      
      setUserProfile(prev => ({
        ...prev,
        settings
      }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Configurações</h1>
        <button 
          className={`save-button ${loading ? 'loading' : ''} ${saveSuccess ? 'success' : ''}`}
          onClick={saveSettings}
          disabled={loading}
        >
          <Save size={20} />
          {loading ? 'Salvando...' : saveSuccess ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </header>

      <div className="settings-grid">
        {/* Notificações */}
        <section className="settings-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>Notificações</h2>
          </div>
          <div className="settings-options">
            <label className="toggle-option">
              <span>Convites de Jogo</span>
              <input
                type="checkbox"
                checked={settings.notifications.gameInvites}
                onChange={(e) => handleSettingChange('notifications', 'gameInvites', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <label className="toggle-option">
              <span>Novas Conquistas</span>
              <input
                type="checkbox"
                checked={settings.notifications.achievements}
                onChange={(e) => handleSettingChange('notifications', 'achievements', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <label className="toggle-option">
              <span>Atualizações do Ranking</span>
              <input
                type="checkbox"
                checked={settings.notifications.rankings}
                onChange={(e) => handleSettingChange('notifications', 'rankings', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <label className="toggle-option">
              <span>Mensagens do Chat</span>
              <input
                type="checkbox"
                checked={settings.notifications.chat}
                onChange={(e) => handleSettingChange('notifications', 'chat', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        {/* Áudio */}
        <section className="settings-section">
          <div className="section-header">
            <Volume2 size={24} />
            <h2>Áudio</h2>
          </div>
          <div className="settings-options">
            <label className="slider-option">
              <span>Volume Geral</span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.audio.master}
                onChange={(e) => handleSettingChange('audio', 'master', parseInt(e.target.value))}
              />
              <span className="value">{settings.audio.master}%</span>
            </label>
            <label className="slider-option">
              <span>Efeitos Sonoros</span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.audio.effects}
                onChange={(e) => handleSettingChange('audio', 'effects', parseInt(e.target.value))}
              />
              <span className="value">{settings.audio.effects}%</span>
            </label>
            <label className="slider-option">
              <span>Música de Fundo</span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.audio.music}
                onChange={(e) => handleSettingChange('audio', 'music', parseInt(e.target.value))}
              />
              <span className="value">{settings.audio.music}%</span>
            </label>
            <label className="slider-option">
              <span>Volume do Chat</span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.audio.chat}
                onChange={(e) => handleSettingChange('audio', 'chat', parseInt(e.target.value))}
              />
              <span className="value">{settings.audio.chat}%</span>
            </label>
          </div>
        </section>

        {/* Display */}
        <section className="settings-section">
          <div className="section-header">
            <Monitor size={24} />
            <h2>Tela</h2>
          </div>
          <div className="settings-options">
            <div className="theme-selector">
              <span>Tema</span>
              <div className="theme-options">
                <label className={`theme-option ${settings.display.theme === 'light' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={settings.display.theme === 'light'}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                  />
                  <span>Claro</span>
                </label>
                <label className={`theme-option ${settings.display.theme === 'dark' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={settings.display.theme === 'dark'}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                  />
                  <span>Escuro</span>
                </label>
                <label className={`theme-option ${settings.display.theme === 'system' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={settings.display.theme === 'system'}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                  />
                  <span>Sistema</span>
                </label>
              </div>
            </div>
            <label className="toggle-option">
              <span>Animações</span>
              <input
                type="checkbox"
                checked={settings.display.animations}
                onChange={(e) => handleSettingChange('display', 'animations', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <label className="toggle-option">
              <span>Modo Compacto</span>
              <input
                type="checkbox"
                checked={settings.display.compactMode}
                onChange={(e) => handleSettingChange('display', 'compactMode', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        {/* Privacidade */}
        <section className="settings-section">
          <div className="section-header">
            <Shield size={24} />
            <h2>Privacidade</h2>
          </div>
          <div className="settings-options">
            <label className="toggle-option">
              <span>Mostrar Status Online</span>
              <input
                type="checkbox"
                checked={settings.privacy.showOnline}
                onChange={(e) => handleSettingChange('privacy', 'showOnline', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <label className="toggle-option">
              <span>Permitir Convites</span>
              <input
                type="checkbox"
                checked={settings.privacy.allowInvites}
                onChange={(e) => handleSettingChange('privacy', 'allowInvites', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <label className="toggle-option">
              <span>Mostrar Estatísticas</span>
              <input
                type="checkbox"
                checked={settings.privacy.showStats}
                onChange={(e) => handleSettingChange('privacy', 'showStats', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;