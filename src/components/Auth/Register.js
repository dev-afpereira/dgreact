import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, database } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Nome de usuário deve conter apenas letras, números e _');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Atualizar o perfil do usuário com o username
      await updateProfile(userCredential.user, {
        displayName: formData.username
      });

      // Criar perfil do usuário no Realtime Database
      await set(ref(database, `users/${userCredential.user.uid}`), {
        username: formData.username,
        email: formData.email,
        createdAt: Date.now(),
        role: 'user',
        status: 'active',
        stats: {
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0
        }
      });

      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no registro:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este email já está registrado');
          break;
        case 'auth/invalid-email':
          setError('Email inválido');
          break;
        case 'auth/operation-not-allowed':
          setError('Registro de usuários está desabilitado');
          break;
        case 'auth/weak-password':
          setError('Senha muito fraca');
          break;
        default:
          setError('Erro ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Criar Conta</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              placeholder="Seu nome de usuário"
              autoComplete="username"
            />
            <small className="form-help">
              Apenas letras, números e _ permitidos
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="seu.email@exemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            <small className="form-help">
              Mínimo de 6 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Confirme sua senha"
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="auth-links">
          <span>Já tem uma conta?</span>
          <Link to="/login">Fazer login</Link>
        </div>

        <div className="terms-privacy">
          Ao criar uma conta, você concorda com nossos{' '}
          <Link to="/terms">Termos de Uso</Link>{' '}
          e{' '}
          <Link to="/privacy">Política de Privacidade</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;