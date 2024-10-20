import React, { useState, useEffect } from 'react';
import './App.css';
import EntradaJogador from './EntradaJogador';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [numero, setNumero] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [message, setMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    setProgresso(numero * 10);
  }, [numero]);

  const addPlayer = (nome) => {
    setPlayers([...players, { id: players.length + 1, name: nome, score: 0, number: '' }]);
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
      setMessage("Jogo iniciado! Escolham seus números.");
    } else {
      alert("São necessários pelo menos 2 jogadores para iniciar o jogo.");
    }
  };

  const handleNumberChange = (id, value) => {
    const newValue = value.replace(/[^1-9]/g, '').slice(0, 2);
    const numberInt = parseInt(newValue);
    
    if (numberInt > 10) {
      setMessage("O número deve ser entre 1 e 10!");
      return;
    }

    const isDuplicate = players.some(player => player.id !== id && player.number === newValue);
    if (isDuplicate) {
      setMessage("Este número já foi escolhido por outro jogador!");
      return;
    }

    setPlayers(players.map(player => 
      player.id === id ? {...player, number: newValue} : player
    ));
    setMessage("");
  };

  const rollDice = () => {
    const newNumber = Math.floor(Math.random() * 10) + 1;
    setNumero(newNumber);

    const winners = players.filter(player => parseInt(player.number) === newNumber);
    if (winners.length > 0) {
      setPlayers(players.map(player => 
        winners.some(winner => winner.id === player.id) 
          ? {...player, score: player.score + 1}
          : player
      ));
      setResultMessage(`${winners.map(w => w.name).join(" e ")} acertou!`);
    } else {
      setResultMessage(`Ninguém acertou desta vez.`);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayers([]);
    setNumero(0);
    setProgresso(0);
    setMessage("");
    setResultMessage("");
  };

  if (!gameStarted) {
    return (
      <div className="container">
        <EntradaJogador onAddPlayer={addPlayer} playersCount={players.length} />
        {players.length > 0 && (
          <div className="card mt-4">
            <h2 className="subtitle">Jogadores:</h2>
            <ul>
              {players.map((player, index) => (
                <li key={index}>{player.name}</li>
              ))}
            </ul>
            <button onClick={startGame} className="button primary-button mt-4">
              Iniciar Jogo ({players.length} jogadores)
            </button>
          </div>
        )}
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
        <div className="progress-container">
          <div className="progress-bar" style={{width: `${progresso}%`}}></div>
        </div>
        <div className="players-container">
          {players.map(player => (
            <div key={player.id} className="player-card">
              <div className="player-name">{player.name}</div>
              <div className="player-score">Pontos: {player.score}</div>
              <input 
                type="text" 
                value={player.number}
                onChange={(e) => handleNumberChange(player.id, e.target.value)}
                placeholder="1-10"
                className="input"
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button onClick={rollDice} className="button primary-button">
            Girar Dado
          </button>
          <button onClick={resetGame} className="button secondary-button">
            Reiniciar
          </button>
        </div>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;