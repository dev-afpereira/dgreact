import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Componentes de Autenticação
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

// Componentes Principais
import DashboardHome from './components/Dashboard/DashboardHome';
import UserProfile from './components/Profile/UserProfile';
import JogoDoNumero from './components/JogoDoNumero/JogoDoNumero';
import SalaDeEspera from './components/SalaDeEspera/SalaDeEspera';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Rota para página inicial (redireciona para dashboard se logado) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } 
        />

        {/* Dashboard e Perfil */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />

        {/* Jogos */}
        <Route 
          path="/sala-de-espera/:gameId" 
          element={
            <ProtectedRoute>
              <SalaDeEspera />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jogo/:gameId" 
          element={
            <ProtectedRoute>
              <JogoDoNumero />
            </ProtectedRoute>
          } 
        />

        {/* Rota padrão para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;