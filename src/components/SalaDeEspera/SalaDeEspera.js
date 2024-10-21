import React from 'react';
import './SalaDeEspera.css';

function SalaDeEspera({ gameId, players, playerId, onStartGame }) {
  return (
    <div className="container">
      <div className="card sala-espera">
        <h2>Sala de Espera</h2>
        <p>ID do Jogo: {gameId}</p>
        <ul>
          {players.map(player => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
        {playerId === players[0]?.id && (
          <button className="button" onClick={onStartGame}>
            Iniciar Jogo ({players.length} jogadores)
          </button>
        )}
      </div>
    </div>
  );
}

export default SalaDeEspera;