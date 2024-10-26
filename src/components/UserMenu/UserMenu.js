import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown, 
  LayoutDashboard, 
  Trophy, 
  Gamepad,
  Medal
} from 'lucide-react';
import './UserMenu.css';

const UserMenu = () => {
  const navigate = useNavigate();
  const { userProfile, logoutUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      color: '#2563eb' 
    },
    { 
      icon: User, 
      label: 'Perfil', 
      path: '/profile',
      color: '#3b82f6' 
    },
    { 
      icon: Gamepad, 
      label: 'Jogos', 
      path: '/games',
      color: '#06b6d4' 
    },
    { 
      icon: Trophy, 
      label: 'Conquistas', 
      path: '/achievements',
      color: '#f59e0b' 
    },
    { 
      icon: Medal, 
      label: 'Ranking', 
      path: '/ranking',
      color: '#8b5cf6' 
    },
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/settings',
      color: '#6b7280' 
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-menu')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="user-menu">
      <button 
        className="user-menu-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="user-avatar">
          {userProfile?.photoURL ? (
            <img 
              src={userProfile.photoURL} 
              alt="Avatar" 
              className="avatar-image"
            />
          ) : (
            <User size={24} className="avatar-icon" />
          )}
        </div>
        <span className="username">{userProfile?.username || 'Usuário'}</span>
        <ChevronDown 
          size={20} 
          className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
        />
      </button>

      {isDropdownOpen && (
        <>
          <div className="dropdown-menu">
            <div className="menu-header">
              <div className="user-info">
                <div className="user-avatar large">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Avatar" 
                      className="avatar-image"
                    />
                  ) : (
                    <User size={32} className="avatar-icon" />
                  )}
                </div>
                <div className="user-details">
                  <span className="user-name">{userProfile?.username}</span>
                  <span className="user-email">{userProfile?.email}</span>
                </div>
              </div>
            </div>

            <div className="menu-items">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="menu-item"
                  onClick={() => {
                    navigate(item.path);
                    setIsDropdownOpen(false);
                  }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="menu-footer">
              <button 
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
          <div className="dropdown-backdrop" onClick={() => setIsDropdownOpen(false)} />
        </>
      )}
    </div>
  );
};

export default UserMenu;