import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, update } from 'firebase/database';
import { storage, database } from '../../config/firebaseConfig';
import { 
  User, 
  Camera, 
  Edit2, 
  Save, 
  X, 
  Mail, 
  Calendar, 
  Award,
  Target,
  Trophy
} from 'lucide-react';
import './Profile.css';

function Profile() {
  const { userProfile, currentUser, setUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    bio: userProfile?.bio || '',
  });

  const [errors, setErrors] = useState({});

  const statsCards = [
    {
      icon: Trophy,
      label: 'Vitórias',
      value: userProfile?.stats?.wins || 0,
      color: '#f59e0b'
    },
    {
      icon: Target,
      label: 'Partidas',
      value: userProfile?.stats?.gamesPlayed || 0,
      color: '#2563eb'
    },
    {
      icon: Award,
      label: 'Taxa de Vitória',
      value: `${userProfile?.stats?.winRate || 0}%`,
      color: '#10b981'
    }
  ];

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileRef = storageRef(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      const userRef = databaseRef(database, `users/${currentUser.uid}`);
      await update(userRef, { photoURL });

      setUserProfile(prev => ({ ...prev, photoURL }));
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Nome de usuário é obrigatório.';
    }
    if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres.';
    }
    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = 'Biografia não pode ter mais de 200 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);
      const userRef = databaseRef(database, `users/${currentUser.uid}`);
      await update(userRef, {
        username: formData.username,
        bio: formData.bio,
      });

      setUserProfile(prev => ({
        ...prev,
        username: formData.username,
        bio: formData.bio,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-container">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Foto de perfil"
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <User size={32} />
              </div>
            )}
          </div>
          <button
            className="upload-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Camera size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="profile-info">
          <div className="info-header">
            <div>
              <h2>{userProfile?.username}</h2>
              <span className="user-email">
                <Mail size={16} />
                {currentUser?.email}
              </span>
              <span className="join-date">
                <Calendar size={16} />
                Membro desde {new Date(userProfile?.createdAt).toLocaleDateString()}
              </span>
            </div>
            {!isEditing && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={20} />
                Editar Perfil
              </button>
            )}
          </div>

          {userProfile?.bio && !isEditing && (
            <p className="bio">{userProfile.bio}</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div 
              className="stat-icon"
              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Nome de usuário</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Seu nome de usuário"
              disabled={loading}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Biografia</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Conte um pouco sobre você"
              rows={4}
              disabled={loading}
            />
            {errors.bio && <span className="error">{errors.bio}</span>}
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              <Save size={20} />
              Salvar Alterações
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              <X size={20} />
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;