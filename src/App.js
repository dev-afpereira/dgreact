import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, update } from 'firebase/database';
import { database } from './firebaseConfig';
import './App.css';
import EntradaJogador from './EntradaJogador';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [numero, setNumero] = useState(0);
  const [message, setMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (gameId) {
      const gameRef = ref(database, `games/${gameId}`);
      onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameStarted(data.started || false);
          setPlayers(Object.values(data.players || {}));
          setNumero(data.currentNumber || 0);
          setResultMessage(data.resultMessage || "");
        }
      });
    }
  }, [gameId]);

  const createOrJoinGame = async (playerName) => {
    let gameReference;
    if (!gameId) {
      gameReference = push(ref(database, 'games'));
      setGameId(gameReference.key);
    } else {
      gameReference = ref(database, `games/${gameId}`);
    }

    const newPlayerRef = push(ref(database, `games/${gameReference.key}/players`));
    await set(newPlayerRef, {
      id: newPlayerRef.key,
      name: playerName,
      score: 0,
      number: ''
    });

    setPlayerId(newPlayerRef.key);
    setMessage(`Bem-vindo, ${playerName}! ID do jogo: ${gameReference.key}`);
  };

  const startGame = async () => {
    if (players.length >= 2) {
      await update(ref(database, `games/${gameId}`), { started: true });
    } else {
      setMessage("São necessários pelo menos 2 jogadores para iniciar o jogo.");
    }
  };

  const handleNumberChange = async (value) => {
    const newValue = value.replace(/[^1-9]/g, '').slice(0, 2);
    const numberInt = parseInt(newValue);
    
    if (numberInt > 10) {
      setMessage("O número deve ser entre 1 e 10!");
      return;
    }

    const isDuplicate = players.some(player => player.id !== playerId && player.number === newValue);
    if (isDuplicate) {
      setMessage("Este número já foi escolhido por outro jogador!");
      return;
    }

    await update(ref(database, `games/${gameId}/players/${playerId}`), { number: newValue });
    setMessage("");
  };

  const rollDice = async () => {
    const newNumber = Math.floor(Math.random() * 10) + 1;
    const updates = {
      currentNumber: newNumber,
      resultMessage: ""
    };

    const winners = players.filter(player => parseInt(player.number) === newNumber);
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
    await set(ref(database, `games/${gameId}`), null);
    setGameId(null);
    setPlayerId(null);
    setGameStarted(false);
    setPlayers([]);
    setNumero(0);
    setMessage("");
    setResultMessage("");
  };

  if (!gameId || !playerId) {
    return <EntradaJogador onAddPlayer={createOrJoinGame} />;
  }

  if (!gameStarted) {
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
            <button onClick={startGame} className="button primary-button mt-4">
              Iniciar Jogo ({players.length} jogadores)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Jogo do Número</h1>
        <div className="number-display">
          {numero === 0 ? '?' : numero}
        </div>
        {resultMessage && <div className="result-message">{resultMessage}</div>}
        <div className="players-container">
          {players.map(player => (
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
        {playerId === players[0]?.id && (
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
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;