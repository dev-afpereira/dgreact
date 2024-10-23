import React from 'react';
import './FimDeJogo.css';

function FimDeJogo({ players, winner, onPlayAgain, onExit, gameMode }) {
  // Ordenar jogadores por pontuação
  const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

  // Calcular estatísticas
  const stats = {
    totalPoints: Object.values(players).reduce((sum, player) => sum + (player.score || 0), 0),
    highestLevel: Math.max(...Object.values(players).map(player => player.level || 1)),
    averageScore: Math.round(
      Object.values(players).reduce((sum, player) => sum + (player.score || 0), 0) / 
      Object.values(players).length
    )
  };

  return (
    <div className="fim-de-jogo-container">
      <div className="fim-de-jogo-content">
        <h1 className="fim-de-jogo-title">Fim de Jogo!</h1>
        
        <div className="winner-section">
          <div className="winner-trophy">🏆</div>
          <h2 className="winner-name">{winner.name}</h2>
          <p className="winner-stats">
            Pontuação Final: {winner.score} pontos<br/>
            Nível Alcançado: {winner.level}
          </p>
        </div>

        <div className="game-stats">
          <h3>Estatísticas do Jogo</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total de Pontos</span>
              <span className="stat-value">{stats.totalPoints}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Maior Nível</span>
              <span className="stat-value">{stats.highestLevel}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Média de Pontos</span>
              <span className="stat-value">{stats.averageScore}</span>
            </div>
          </div>
        </div>

        <div className="rankings">
          <h3>Classificação Final</h3>
          <div className="rankings-list">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id} 
                className={`ranking-item ${player.id === winner.id ? 'winner' : ''}`}
              >
                <span className="position">{index + 1}º</span>
                <span className="player-info">
                  <span className="name">{player.name}</span>
                  <span className="details">
                    {player.score} pontos - Nível {player.level}
                  </span>
                </span>
                {player.id === winner.id && <span className="winner-badge">👑</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="game-mode-info">
          <p>Modo de Jogo: {gameMode === 'bestOfThree' ? 'Melhor de 3' : 'Normal'}</p>
        </div>

        <div className="action-buttons">
          <button onClick={onPlayAgain} className="button play-again">
            Jogar Novamente
          </button>
          <button onClick={onExit} className="button exit-game">
            Sair do Jogo
          </button>
        </div>
      </div>
    </div>
  );
}

export default FimDeJogo;