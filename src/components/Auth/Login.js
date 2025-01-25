import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

function Login() {
  const authContext = useAuth();
  console.log('Auth Context:', authContext); // Para debug
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (typeof authContext.loginUser !== 'function') {
        throw new Error('Função de login não está disponível');
      }
      await authContext.loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Firebase error code:', err.code);
      console.error('Firebase error message:', err.message);
      toast.error(
        `Erro no login: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {authContext.error && <div className="auth-error">{authContext.error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">Criar uma conta</Link>
          <Link to="/reset-password">Esqueci minha senha</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;