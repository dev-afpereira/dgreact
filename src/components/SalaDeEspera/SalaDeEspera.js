import React, { useState } from 'react';
import './SalaDeEspera.css';

function SalaDeEspera({ gameId, players = {}, playerId, onStartGame }) {
  const [gameMode, setGameMode] = useState('normal');

  const handleStartGame = () => {
    onStartGame(gameMode);
  };

  const playerKeys = Object.keys(players);
  const isAdmin = playerId === playerKeys[0];

  return (
    <div className="container">
      <div className="card sala-espera">
        <h2>Sala de Espera</h2>
        <p>ID do Jogo: {gameId}</p>
        <ul className="players-list">
          {playerKeys.length > 0 ? (
            playerKeys.map(key => {
              const player = players[key];
              return (
                <li key={player.id} className="player-item">
                  <span className="player-name">{player.name}</span>
                  <span className="player-info">Nível: {player.level || 1}, Pontos: {player.score || 0}</span>
                </li>
              );
            })
          ) : (
            <li className="player-item">Nenhum jogador na sala.</li>
          )}
        </ul>
        {isAdmin && (
          <div className="game-options">
            <select 
              value={gameMode} 
              onChange={(e) => setGameMode(e.target.value)}
              className="game-mode-select"
            >
              <option value="normal">Modo Normal</option>
              <option value="bestOfThree">Melhor de 3</option>
            </select>
            <button className="button start-game" onClick={handleStartGame}>
              Iniciar Jogo ({playerKeys.length} jogadores)
            </button>
          </div>
        )}
        {!isAdmin && (
          <p className="waiting-message">Aguardando o anfitrião iniciar o jogo...</p>
        )}
      </div>
    </div>
  );
}

export default SalaDeEspera;