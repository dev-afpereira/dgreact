import React, { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { initializeDatabase } from './services/DatabaseInitService';

// Componentes de Autenticação
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

// Layout Principal
import DashboardLayout from './components/Dashboard/DashboardLayout';

// Página Inicial
import LandingPage from './components/LandingPage/LandingPage';

// Componentes do Jogo
import JogoDoNumeroContainer from './components/JogoDoNumero/JogoDoNumeroContainer';
import SalaDeEsperaContainer from './components/SalaDeEspera/SalaDeEsperaContainer';

// Componentes do Dashboard (Lazy Loading)
const DashboardHome = lazy(() => import('./components/Dashboard/DashboardHome'));
const UserProfile = lazy(() => import('./components/Profile/UserProfile'));
const GamesHub = lazy(() => import('./components/Games/GamesHub'));
const Achievements = lazy(() => import('./components/Achievements/Achievements'));
const Ranking = lazy(() => import('./components/Ranking/Ranking'));
const Settings = lazy(() => import('./components/Settings/Settings'));

function App() {
  const [notification, setNotification] = useState(null); // Estado para notificações

  useEffect(() => {
    initializeDatabase();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Limpar a notificação após 3 segundos
  };

  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Carregando...</div>}>
          {notification && <div className="notification">{notification}</div>} {/* Exibir notificação */}
          <Routes>
            {/* Landing Page (Página Inicial Pública) */}
            <Route path="/" element={<LandingPage />} />

            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Rotas Protegidas com DashboardLayout */}
            <Route 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/games" element={<GamesHub />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Rotas do Jogo */}
            <Route
              path="/sala-de-espera/:gameId"
              element={
                <ProtectedRoute>
                  <SalaDeEsperaContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jogo/:gameId"
              element={
                <ProtectedRoute>
                  <JogoDoNumeroContainer />
                </ProtectedRoute>
              }
            />

            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

// Não precisamos mais do AppWrapper
export default App;