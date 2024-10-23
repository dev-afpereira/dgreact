import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { updateProfile, deleteUser } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { database } from '../../config/firebaseConfig';
import './Profile.css';

function UserProfile() {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: userProfile?.username || '',
    bio: userProfile?.bio || '',
    socialLinks: userProfile?.socialLinks || {
      twitter: '',
      twitch: '',
      youtube: ''
    },
    notifications: userProfile?.notifications?.preferences || {
      email: true,
      push: true
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateProfile(currentUser, {
        displayName: formData.displayName
      });

      const userRef = ref(database, `users/${currentUser.uid}`);
      const updates = {
        username: formData.displayName,
        bio: formData.bio,
        socialLinks: formData.socialLinks,
        'notifications/preferences': formData.notifications,
        updatedAt: Date.now()
      };

      await update(userRef, updates);

      setUserProfile(prev => ({
        ...prev,
        ...updates
      }));

      setIsEditing(false);
    } catch (error) {
      setError('Erro ao atualizar perfil. Por favor, tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const userRef = ref(database, `users/${currentUser.uid}`);
      await update(userRef, {
        status: 'deleted',
        deletedAt: Date.now()
      });

      await deleteUser(currentUser);
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setError('Erro ao excluir conta. Por favor, tente novamente.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={currentUser.photoURL || '/default-avatar.png'} 
              alt="Avatar" 
            />
            {isEditing && (
              <button className="change-avatar-button">
                Mudar Avatar
              </button>
            )}
          </div>

          <div className="profile-info">
            <h1>{userProfile?.username}</h1>
            <div className="profile-badges">
              <span className="badge level">Nível {userProfile?.level || 1}</span>
              {userProfile?.role === 'admin' && (
                <span className="badge admin">Admin</span>
              )}
              {userProfile?.achievements?.length > 0 && (
                <span className="badge achievements">
                  {userProfile.achievements.length} Conquistas
                </span>
              )}
            </div>
          </div>

          {!isEditing && (
            <button 
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Informações Básicas</h2>
              <div className="form-group">
                <label>Nome de Usuário</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Biografia</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={loading}
                  rows="4"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Redes Sociais</h2>
              {['twitter', 'twitch', 'youtube'].map(platform => (
                <div key={platform} className="form-group">
                  <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                  <input
                    type="text"
                    value={formData.socialLinks[platform] || ''}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    disabled={loading}
                    placeholder={`Seu ${platform}`}
                  />
                </div>
              ))}
            </div>

            <div className="form-section">
              <h2>Notificações</h2>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="emailNotif"
                  checked={formData.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="emailNotif">Receber notificações por email</label>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="pushNotif"
                  checked={formData.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="pushNotif">Receber notificações push</label>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="save-button"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-content">
            <section className="profile-section">
              <h2>Sobre</h2>
              <p>{userProfile?.bio || 'Nenhuma biografia adicionada.'}</p>
            </section>

            {Object.keys(userProfile?.socialLinks || {}).length > 0 && (
              <section className="profile-section">
                <h2>Redes Sociais</h2>
                <div className="social-links">
                  {Object.entries(userProfile.socialLinks).map(([platform, link]) => (
                    link && (
                      <a 
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`social-link ${platform}`}
                      >
                        <i className={`fab fa-${platform}`}></i>
                        {platform}
                      </a>
                    )
                  ))}
                </div>
              </section>
            )}

            <section className="profile-section">
              <h2>Estatísticas</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">
                    {userProfile?.stats?.gamesPlayed || 0}
                  </span>
                  <span className="stat-label">Partidas Jogadas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {userProfile?.stats?.wins || 0}
                  </span>
                  <span className="stat-label">Vitórias</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {((userProfile?.stats?.wins / userProfile?.stats?.gamesPlayed) * 100 || 0).toFixed(1)}%
                  </span>
                  <span className="stat-label">Taxa de Vitória</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {userProfile?.stats?.highestScore || 0}
                  </span>
                  <span className="stat-label">Maior Pontuação</span>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h2>Conquistas Recentes</h2>
              <div className="achievements-grid">
                {userProfile?.achievements?.slice(-3).map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-details">
                      <h3>{achievement.name}</h3>
                      <p>{achievement.description}</p>
                      <span className="achievement-date">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {userProfile?.achievements?.length > 3 && (
                <button 
                  className="view-all-button"
                  onClick={() => navigate('/dashboard/achievements')}
                >
                  Ver Todas as Conquistas
                </button>
              )}
            </section>

            <section className="profile-section">
              <h2>Histórico de Partidas</h2>
              <div className="matches-history">
                {userProfile?.matchHistory?.slice(-5).map(match => (
                  <div key={match.id} className="match-item">
                    <div className="match-header">
                      <span className={`match-result ${match.won ? 'victory' : 'defeat'}`}>
                        {match.won ? 'Vitória' : 'Derrota'}
                      </span>
                      <span className="match-date">
                        {new Date(match.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="match-details">
                      <div className="match-mode">
                        <span className="mode-label">Modo:</span>
                        <span className="mode-value">{match.gameMode}</span>
                      </div>
                      <div className="match-score">
                        <span className="score-label">Pontuação:</span>
                        <span className="score-value">{match.score}</span>
                      </div>
                      <div className="match-players">
                        <span className="players-label">Jogadores:</span>
                        <span className="players-value">
                          {match.players.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {userProfile?.matchHistory?.length > 5 && (
                <button 
                  className="view-all-button"
                  onClick={() => navigate('/dashboard/history')}
                >
                  Ver Histórico Completo
                </button>
              )}
            </section>

            <section className="profile-section">
              <h2>Preferências de Notificação</h2>
              <div className="notification-preferences">
                <div className="notification-item">
                  <span className="notification-type">Email</span>
                  <span className={`notification-status ${userProfile?.notifications?.preferences?.email ? 'active' : 'inactive'}`}>
                    {userProfile?.notifications?.preferences?.email ? 'Ativado' : 'Desativado'}
                  </span>
                </div>
                <div className="notification-item">
                  <span className="notification-type">Push</span>
                  <span className={`notification-status ${userProfile?.notifications?.preferences?.push ? 'active' : 'inactive'}`}>
                    {userProfile?.notifications?.preferences?.push ? 'Ativado' : 'Desativado'}
                  </span>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h2>Configurações da Conta</h2>
              <div className="account-actions">
                <button 
                  className="action-button"
                  onClick={() => navigate('/dashboard/security')}
                >
                  <i className="fas fa-lock"></i>
                  Alterar Senha
                </button>
                <button 
                  className="action-button"
                  onClick={() => navigate('/dashboard/privacy')}
                >
                  <i className="fas fa-user-shield"></i>
                  Privacidade
                </button>
                {userProfile?.role === 'admin' && (
                  <button 
                    className="action-button admin"
                    onClick={() => navigate('/admin')}
                  >
                    <i className="fas fa-cog"></i>
                    Painel Admin
                  </button>
                )}
                <button 
                  className="action-button danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="fas fa-trash-alt"></i>
                  Excluir Conta
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Excluir Conta</h2>
            <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="delete-button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Excluindo...' : 'Excluir Conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default UserProfile;