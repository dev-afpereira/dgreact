import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EntradaJogador.css';

function EntradaJogador({ onAddPlayer }) {
  const [nome, setNome] = useState('');
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit chamado');
  
    if (nome.trim() !== '') {
      try {
        console.log('Tentando adicionar jogador:', nome, gameId);
        const resultGameId = await onAddPlayer(nome, gameId, gameId ? 'join' : 'create');
        console.log('Jogador adicionado, resultGameId:', resultGameId);
  
        if (resultGameId) {
          console.log('Navegando para:', `/sala-de-espera/${resultGameId}`);
          navigate(`/sala-de-espera/${resultGameId}`);
        } else {
          console.error('resultGameId é undefined ou null');
        }
      } catch (error) {
        console.error('Erro ao adicionar jogador:', error);
        alert(`Erro ao ${gameId ? 'juntar-se ao' : 'criar'} jogo: ${error.message}`);
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