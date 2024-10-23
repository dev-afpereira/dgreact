import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../services/AuthService';
import './Auth.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Recuperar Senha</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        {success ? (
          <div className="auth-success">
            <p>Email de recuperação enviado!</p>
            <p>Por favor, verifique sua caixa de entrada.</p>
            <div className="auth-links">
              <Link to="/login">Voltar para o Login</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="auth-description">
              Digite seu email para receber um link de recuperação de senha.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>

            <div className="auth-links">
              <Link to="/login">Voltar para o Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;