import React, { useState } from 'react';
import './EntradaJogador.css';

function EntradaJogador({ onAddPlayer }) {
  const [nome, setNome] = useState('');
  const [gameId, setGameId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim() !== '') {
      if (gameId.trim() !== '') {
        onAddPlayer(nome, gameId, 'join');
      } else {
        onAddPlayer(nome, null, 'create');
      }
    } else {
      alert('Por favor, insira seu nome.');
    }
  };

  return (
    <div className="entrada-container">
      <div className="card">
        <h1 className="title">Jogo do Número</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="input"
          />
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="ID do Jogo (opcional)"
            className="input"
          />
          <button type="submit" className="button">
            {gameId ? 'Juntar-se ao Jogo' : 'Criar Novo Jogo'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EntradaJogador;