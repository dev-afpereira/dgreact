import React from 'react';
import { useEffect } from 'react';


function SalaDeEspera({ gameId, players, playerId, onStartGame }) {
  useEffect(() => {
    console.log('SalaDeEspera renderizada com gameId:', gameId);
  }, [gameId]);
 
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Sala de Espera</h1>
        <p>ID do Jogo: {gameId}</p>
        <h2 className="subtitle">Jogadores:</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
        {playerId === players[0]?.id && (
        <button onClick={onStartGame} className="button primary-button">
          Iniciar Jogo ({players.length} jogadores)
        </button>
      )}
      </div>
    </div>
  );
}

export default SalaDeEspera;