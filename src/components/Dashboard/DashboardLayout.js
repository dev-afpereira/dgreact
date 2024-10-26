import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/AuthService';
import { 
  Home,
  User,
  Gamepad,
  Trophy,
  Medal,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  BellRing,
  ChevronRight
} from 'lucide-react';
import './DashboardLayout.css';

function DashboardLayout() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Início',
      description: 'Visão geral e atividades recentes'
    },
    {
      path: '/profile',
      icon: User,
      label: 'Perfil',
      description: 'Gerencie suas informações pessoais'
    },
    {
      path: '/games',
      icon: Gamepad,
      label: 'Jogos',
      description: 'Jogue e veja seu histórico'
    },
    {
      path: '/achievements',
      icon: Trophy,
      label: 'Conquistas',
      description: 'Veja suas conquistas e desafios'
    },
    {
      path: '/ranking',
      icon: Medal,
      label: 'Ranking',
      description: 'Compare seu desempenho'
    }
  ];

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
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* User Profile Section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                <User size={24} />
              </div>
            )}
            <div className="user-status" />
          </div>
          <div className="user-info">
            <h3 className="user-name">{userProfile?.username || 'Usuário'}</h3>
            <span className="user-level">Nível {userProfile?.level || 1}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <div className="nav-item-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
              <ChevronRight size={16} className="nav-arrow" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button 
            className="settings-button"
            onClick={() => navigate('/settings')}
          >
            <SettingsIcon size={20} />
            <span>Configurações</span>
          </button>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="breadcrumb">
            <h1>{getPageTitle(location.pathname)}</h1>
          </div>
          <div className="header-actions">
            <button className="notification-button">
              <BellRing size={20} />
              {userProfile?.notifications?.unread > 0 && (
                <span className="notification-badge">
                  {userProfile.notifications.unread}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function getPageTitle(pathname) {
  const titles = {
    '/dashboard': 'Dashboard',
    '/profile': 'Perfil',
    '/games': 'Jogos',
    '/achievements': 'Conquistas',
    '/ranking': 'Ranking',
    '/settings': 'Configurações'
  };
  return titles[pathname] || 'Dashboard';
}

export default DashboardLayout;