import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [numero, setNumero] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [players, setPlayers] = useState([
    { id: 1, name: "André", score: 0, number: '' },
    { id: 2, name: "Aline", score: 0, number: '' },
    { id: 3, name: "Ana Luiza", score: 0, number: '' },
    { id: 4, name: "Lucas", score: 0, number: '' },
  ]);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    setProgresso(numero * 10);
  }, [numero]);

  const handleNumberChange = (id, value) => {
    const newValue = value.replace(/[^1-9]/g, '').slice(0, 2);
    const numberInt = parseInt(newValue);
    
    if (numberInt > 10) {
      setMessage("O número deve ser entre 1 e 10!");
      return;
    }

    const isDuplicate = players.some(player => player.id !== id && parseInt(player.number) === numberInt);
    if (isDuplicate) {
      setMessage("Este número já foi escolhido por outro jogador!");
      return;
    }

    setPlayers(players.map(player => 
      player.id === id ? {...player, number: newValue} : player
    ));
    setMessage("");
  };

  const startGame = () => {
    if (players.some(player => player.number === '')) {
      setMessage("Todos os jogadores devem escolher um número entre 1 e 10!");
      return;
    }
    setGameStarted(true);
    setMessage("Jogo iniciado! Clique em 'Girar Dado' para jogar.");
    setResultMessage("");
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
    setNumero(0);
    setProgresso(0);
    setPlayers(players.map(player => ({ ...player, score: 0, number: '' })));
    setMessage("");
    setResultMessage("");
    setGameStarted(false);
  };

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
                disabled={gameStarted}
                placeholder="1-10"
                className="input"
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          {!gameStarted ? (
            <button onClick={startGame} className="button primary-button">
              Iniciar Jogo
            </button>
          ) : (
            <button onClick={rollDice} className="button primary-button">
              Girar Dado
            </button>
          )}
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