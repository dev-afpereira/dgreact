import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/AuthService';
import './Dashboard.css';

function DashboardLayout({ children }) {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <img 
              src={currentUser.photoURL || '/default-avatar.png'} 
              alt="Avatar" 
              className="user-avatar"
            />
            <div className="user-details">
              <h3>{userProfile?.username || 'Usuário'}</h3>
              <span className="user-level">Nível {userProfile?.level || 1}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <i className="fas fa-home"></i>
            <span>Início</span>
          </Link>
          <Link to="/dashboard/profile" className="nav-item">
            <i className="fas fa-user"></i>
            <span>Perfil</span>
          </Link>
          <Link to="/dashboard/games" className="nav-item">
            <i className="fas fa-gamepad"></i>
            <span>Jogos</span>
          </Link>
          <Link to="/dashboard/achievements" className="nav-item">
            <i className="fas fa-trophy"></i>
            <span>Conquistas</span>
          </Link>
          <Link to="/dashboard/stats" className="nav-item">
            <i className="fas fa-chart-bar"></i>
            <span>Estatísticas</span>
          </Link>
          <Link to="/dashboard/ranking" className="nav-item">
            <i className="fas fa-medal"></i>
            <span>Ranking</span>
          </Link>
          {userProfile?.role === 'admin' && (
            <Link to="/admin" className="nav-item admin-link">
              <i className="fas fa-cog"></i>
              <span>Admin</span>
            </Link>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-actions">
            <button className="notifications-button">
              <i className="fas fa-bell"></i>
              {userProfile?.notifications?.unread > 0 && (
                <span className="notifications-badge">
                  {userProfile.notifications.unread}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;