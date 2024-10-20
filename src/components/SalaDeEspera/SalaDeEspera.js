import React from 'react';

function SalaDeEspera({ gameId, players, playerId, onStartGame }) {
  console.log('Renderizando SalaDeEspera', { gameId, players, playerId });

  return (
    <div>
      <h2>Sala de Espera</h2>
      <p>ID do Jogo: {gameId}</p>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      {playerId === players[0]?.id && (
        <button onClick={onStartGame}>Iniciar Jogo ({players.length} jogadores)</button>
      )}
    </div>
  );
}

export default SalaDeEspera;