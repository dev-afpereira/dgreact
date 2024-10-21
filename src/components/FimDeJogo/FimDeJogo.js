import React from 'react';
import './FimDeJogo.css';

function FimDeJogo({ players, winner, onPlayAgain, onExit }) {
  const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

  return (
    <div className="fim-de-jogo">
      <h1 className="game-over-title">Fim de Jogo</h1>
      <div className="winner-announcement">
        <h2>Vencedor: {winner.name}</h2>
        <p>Pontuação: {winner.score}</p>
      </div>
      <div className="player-rankings">
        <h3>Classificação Final</h3>
        <ol>
          {sortedPlayers.map((player) => (
            <li key={player.id} className={player.id === winner.id ? 'winner' : ''}>
              {player.name} - {player.score} pontos (Nível {player.level})
            </li>
          ))}
        </ol>
      </div>
      <div className="game-over-actions">
        <button onClick={onPlayAgain} className="button play-again">Jogar Novamente</button>
        <button onClick={onExit} className="button exit-game">Sair do Jogo</button>
      </div>
    </div>
  );
}

export default FimDeJogo;