import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';

function Unauthorized() {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>401</h1>
        <h2>Acesso não autorizado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
        <Link to="/" className="error-button">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;