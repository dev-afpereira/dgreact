import React, { useState } from 'react';

function EntradaJogador({ onAddPlayer, playersCount }) {
  const [nome, setNome] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim() !== '') {
      onAddPlayer(nome);
      setNome('');
    }
  };

  return (
    <div className="card">
      <h1 className="title">Jogo do Número</h1>
      <h2 className="subtitle">Jogador {playersCount + 1}, insira seu nome</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          className="input"
        />
        <button type="submit" className="button primary-button">
          Juntar-se ao Jogo
        </button>
      </form>
    </div>
  );
}

export default EntradaJogador;