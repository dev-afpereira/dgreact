import React, { useState, useEffect } from 'react';
import { ref, update, onValue } from 'firebase/database';
import './JogoDoNumero.css';

function JogoDoNumero({ gameState, playerId, database, gameId }) {
  const [selectedNumber, setSelectedNumber] = useState('');
  const [currentTurn, setCurrentTurn] = useState('');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentTurn(data.currentTurn || Object.keys(data.players)[0]);
        setMessage(data.message || '');
        setPlayers(data.players || {});
      }
    });
  }, [database, gameId]);

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    if (selectedNumber >= 1 && selectedNumber <= 10) {
      await update(ref(database, `games/${gameId}/players/${playerId}`), {
        number: selectedNumber
      });
      setSelectedNumber('');
    } else {
      alert('Por favor, escolha um número entre 1 e 10.');
    }
  };

  const rollDice = async () => {
    const diceNumber = Math.floor(Math.random() * 10) + 1;
    const winners = Object.values(players).filter(player => parseInt(player.number) === diceNumber);
    
    let newMessage = `O dado rolou ${diceNumber}. `;
    if (winners.length > 0) {
      newMessage += `${winners.map(w => w.name).join(' e ')} acertou!`;
      await Promise.all(winners.map(winner => 
        update(ref(database, `games/${gameId}/players/${winner.id}`), {
          score: (winner.score || 0) + 1
        })
      ));
    } else {
      newMessage += 'Ninguém acertou desta vez.';
    }

    const playerIds = Object.keys(players);
    const nextPlayerIndex = (playerIds.indexOf(currentTurn) + 1) % playerIds.length;
    const nextPlayerId = playerIds[nextPlayerIndex];

    await update(ref(database, `games/${gameId}`), {
      currentTurn: nextPlayerId,
      message: newMessage
    });
  };

  const resetGame = async () => {
    const resetPlayers = Object.entries(players).reduce((acc, [id, player]) => {
      acc[id] = { ...player, number: '', score: 0 };
      return acc;
    }, {});

    await update(ref(database, `games/${gameId}`), {
      players: resetPlayers,
      currentTurn: Object.keys(players)[0],
      message: 'O jogo foi reiniciado. Escolham seus números!',
    });
  };

  const isPlayerTurn = currentTurn === playerId;
  const hasSelectedNumber = players[playerId]?.number !== undefined && players[playerId]?.number !== '';
  const isAdmin = playerId === Object.keys(players)[0]; // Assume que o primeiro jogador é o admin

  return (
    <div className="container jogo-do-numero">
      <h1 className="game-title">Jogo do Número</h1>

      <div className="players-overview">
        {Object.values(players).map((player) => (
          <div key={player.id} className={`player-overview ${currentTurn === player.id ? 'current-turn' : ''}`}>
            <div className="player-name">{player.name}</div>
            <div className="player-number">{player.number || '?'}</div>
            <div className="player-score">Pontos: {player.score || 0}</div>
            <div className="player-turn-info">
              {currentTurn === player.id ? 'Sua vez!' : 'Aguarde...'}
            </div>
          </div>
        ))}
      </div>

      {message && <p className="message">{message}</p>}

      <div className="game-controls">
        <form onSubmit={handleNumberSubmit} className="number-input">
          <input
            type="number"
            min="1"
            max="10"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            placeholder="1-10"
            className="input"
            disabled={hasSelectedNumber}
          />
          <button type="submit" className="button" disabled={hasSelectedNumber}>
            Confirmar Número
          </button>
        </form>

        <div className="action-buttons">
          {isPlayerTurn && (
            <button onClick={rollDice} className="button roll-button">Girar Dado</button>
          )}
          {isAdmin && (
            <button onClick={resetGame} className="button reset-button">Reiniciar Jogo</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JogoDoNumero;