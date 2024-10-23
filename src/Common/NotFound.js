import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';

function NotFound() {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi removida.</p>
        <Link to="/" className="error-button">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}

export default NotFound;