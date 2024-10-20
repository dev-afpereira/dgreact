import React from 'react';
import { ref, update, set } from 'firebase/database';

function JogoDoNumero({ gameState, playerId, database, gameId }) {
  const handleNumberChange = async (value) => {
    const newValue = value.replace(/[^1-9]/g, '').slice(0, 2);
    const numberInt = parseInt(newValue);
    
    if (numberInt > 10) {
      alert("O número deve ser entre 1 e 10!");
      return;
    }

    const isDuplicate = Object.values(gameState.players).some(player => player.id !== playerId && player.number === newValue);
    if (isDuplicate) {
      alert("Este número já foi escolhido por outro jogador!");
      return;
    }

    await update(ref(database, `games/${gameId}/players/${playerId}`), { number: newValue });
  };

  const rollDice = async () => {
    const newNumber = Math.floor(Math.random() * 10) + 1;
    const updates = {
      currentNumber: newNumber,
      resultMessage: ""
    };

    const winners = Object.values(gameState.players).filter(player => parseInt(player.number) === newNumber);
    if (winners.length > 0) {
      winners.forEach(winner => {
        updates[`players/${winner.id}/score`] = (winner.score || 0) + 1;
      });
      updates.resultMessage = `${winners.map(w => w.name).join(" e ")} acertou!`;
    } else {
      updates.resultMessage = `Ninguém acertou desta vez.`;
    }

    await update(ref(database, `games/${gameId}`), updates);
  };

  const resetGame = async () => {
    await set(ref(database, `games/${gameId}/started`), false);
    await update(ref(database, `games/${gameId}`), {
      currentNumber: 0,
      resultMessage: "",
      players: Object.fromEntries(
        Object.entries(gameState.players).map(([key, player]) => [key, {...player, number: '', score: 0}])
      )
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Jogo do Número</h1>
        <div className="number-display">
          {gameState.currentNumber === 0 ? '?' : gameState.currentNumber}
        </div>
        {gameState.resultMessage && <div className="result-message">{gameState.resultMessage}</div>}
        <div className="players-container">
          {Object.values(gameState.players).map(player => (
            <div key={player.id} className="player-card">
              <div className="player-name">{player.name}</div>
              <div className="player-score">Pontos: {player.score || 0}</div>
              {player.id === playerId && (
                <input 
                  type="text" 
                  value={player.number || ''}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="1-10"
                  className="input"
                />
              )}
              {player.id !== playerId && (
                <div>{player.number ? 'Número escolhido' : 'Aguardando...'}</div>
              )}
            </div>
          ))}
        </div>
        {playerId === Object.values(gameState.players)[0]?.id && (
          <div className="button-container">
            <button onClick={rollDice} className="button primary-button">
              Girar Dado
            </button>
            <button onClick={resetGame} className="button secondary-button">
              Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JogoDoNumero;