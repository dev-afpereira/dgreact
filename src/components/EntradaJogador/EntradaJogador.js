import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EntradaJogador.css';

function EntradaJogador({ onAddPlayer }) {
  const [nome, setNome] = useState('');
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulário submetido:', { nome, gameId });
    if (nome.trim() !== '') {
      try {
        const resultGameId = await onAddPlayer(nome, gameId, gameId ? 'join' : 'create');
        console.log('Jogo criado/unido com sucesso, ID:', resultGameId);
        navigate(`/sala-de-espera/${resultGameId}`);
      } catch (error) {
        console.error('Erro ao criar/unir jogo:', error);
        alert(`Erro ao ${gameId ? 'juntar-se ao' : 'criar'} jogo: ${error.message}`);
      }
    } else {
      alert('Por favor, insira seu nome.');
    }
  };

  return (
    <div className="container">
      <div className="card entrada-jogador">
        <h2>Jogo do Número</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            required
          />
          <input
            className="input"
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="ID do Jogo (opcional)"
          />
          <button className="button" type="submit">
            {gameId ? 'Juntar-se ao Jogo' : 'Criar Novo Jogo'}
          </button>
        </form>
      </div>
    </div>
  );
}


export default EntradaJogador;