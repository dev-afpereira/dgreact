import React, { useState, useEffect, useRef } from 'react';
import { ref, update, onValue, get } from 'firebase/database';
import './JogoDoNumero.css';
import FimDeJogo from '../FimDeJogo/FimDeJogo';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
}

function JogoDoNumero({ gameState, playerId, database, gameId, onExitGame }) {
  const [selectedNumber, setSelectedNumber] = useState('');
  const [currentTurn, setCurrentTurn] = useState('');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState({});
  const [isRolling, setIsRolling] = useState(false);
  const [winners, setWinners] = useState([]);
  const [diceResult, setDiceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameMode, setGameMode] = useState('normal');
  const [roundWins, setRoundWins] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);
  const messageRef = useRef(null);
  const diceRef = useRef(null);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentTurn(data.currentTurn || Object.keys(data.players)[0]);
        setMessage(data.message || '');
        setPlayers(data.players || {});
        setWinners(data.winners || []);
        setDiceResult(data.diceResult || null);
        setGameMode(data.gameMode || 'normal');
        setRoundWins(data.roundWins || {});
        
        if (data.gameOver) {
          setGameOver(true);
          setGameWinner(data.players[data.winner]);
        }
      }
    });
  }, [database, gameId]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.classList.remove('new-message');
      void messageRef.current.offsetWidth; // Trigger reflow
      messageRef.current.classList.add('new-message');
    }
  }, [message]);

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    if (selectedNumber >= 1 && selectedNumber <= 10) {
      setIsLoading(true);
      try {
        await update(ref(database, `games/${gameId}/players/${playerId}`), {
          number: selectedNumber
        });
        setSelectedNumber('');
      } catch (error) {
        console.error("Erro ao submeter número:", error);
        alert("Houve um erro ao submeter seu número. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Por favor, escolha um número entre 1 e 10.');
    }
  };

  const calculateLevel = (score) => {
    if (score <= 50) return 1;
    if (score <= 100) return 2;
    if (score <= 200) return 3;
    if (score <= 500) return 4;
    return 5;
  };

  const rollDice = async () => {
    setIsRolling(true);
    setIsLoading(true);
    
    if (diceRef.current) {
      diceRef.current.classList.add('rolling');
    }
    
    try {
      const diceNumber = Math.floor(Math.random() * 10) + 1;
      const newWinners = Object.values(players).filter(player => parseInt(player.number) === diceNumber);
      
      let newMessage = `O dado rolou ${diceNumber}. `;
      if (newWinners.length > 0) {
        newMessage += `${newWinners.map(w => w.name).join(' e ')} acertou!`;
        await Promise.all(newWinners.map(async (winner) => {
          const playerRef = ref(database, `games/${gameId}/players/${winner.id}`);
          const playerSnapshot = await get(playerRef);
          const playerData = playerSnapshot.val();

          const consecutiveHits = (playerData.consecutiveHits || 0) + 1;
          let multiplier = 1;
          if (consecutiveHits === 2) multiplier = 1.5;
          else if (consecutiveHits === 3) multiplier = 2;
          else if (consecutiveHits >= 4) multiplier = 3;

          const newScore = playerData.score + Math.round(10 * multiplier);
          const newLevel = calculateLevel(newScore);

          await update(playerRef, {
            score: newScore,
            consecutiveHits: consecutiveHits,
            level: newLevel
          });
        }));

        if (gameMode === 'bestOfThree') {
          const updatedRoundWins = {...roundWins};
          newWinners.forEach(winner => {
            updatedRoundWins[winner.id] = (updatedRoundWins[winner.id] || 0) + 1;
            if (updatedRoundWins[winner.id] === 3) {
              newMessage += ` ${winner.name} venceu o jogo!`;
              endGame(winner);
            }
          });
          await update(ref(database, `games/${gameId}`), { roundWins: updatedRoundWins });
        }
      } else {
        newMessage += 'Ninguém acertou desta vez.';
        // Reset consecutiveHits for all players
        await Promise.all(Object.keys(players).map(playerId => 
          update(ref(database, `games/${gameId}/players/${playerId}`), {
            consecutiveHits: 0
          })
        ));
      }

      const playerIds = Object.keys(players);
      const nextPlayerIndex = (playerIds.indexOf(currentTurn) + 1) % playerIds.length;
      const nextPlayerId = playerIds[nextPlayerIndex];

      await update(ref(database, `games/${gameId}`), {
        currentTurn: nextPlayerId,
        message: newMessage,
        winners: newWinners.map(w => w.id),
        diceResult: diceNumber
      });

      setTimeout(() => {
        if (diceRef.current) {
          diceRef.current.classList.remove('rolling');
        }
        setIsRolling(false);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Erro ao rolar o dado:", error);
      alert("Houve um erro ao rolar o dado. Por favor, tente novamente.");
      setIsRolling(false);
      setIsLoading(false);
    }
  };

  const resetGame = async () => {
    setIsLoading(true);
    try {
      const resetPlayers = Object.entries(players).reduce((acc, [id, player]) => {
        acc[id] = { ...player, number: '', score: 0, consecutiveHits: 0, level: 1 };
        return acc;
      }, {});

      const resetData = {
        players: resetPlayers,
        currentTurn: Object.keys(players)[0],
        message: 'O jogo foi reiniciado. Escolham seus números!',
        winners: [],
        diceResult: null,
        roundWins: {},
        gameOver: false,
        winner: null
      };
      await update(ref(database, `games/${gameId}`), resetData);
      setGameOver(false);
      setGameWinner(null);
    } catch (error) {
      console.error("Erro ao resetar o jogo:", error);
      alert("Houve um erro ao resetar o jogo. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const endGame = async (winner) => {
    try {
      await update(ref(database, `games/${gameId}`), {
        gameOver: true,
        winner: winner.id
      });
    } catch (error) {
      console.error("Erro ao finalizar o jogo:", error);
    }
  };

  const renderGameModeInfo = () => {
    if (gameMode === 'bestOfThree') {
      return (
        <div className="game-mode-info">
          <h3>Modo: Melhor de 3</h3>
          {Object.entries(roundWins).map(([playerId, wins]) => (
            <p key={playerId}>{players[playerId].name}: {wins} vitória(s)</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isPlayerTurn = currentTurn === playerId;
  const hasSelectedNumber = players[playerId]?.number !== undefined && players[playerId]?.number !== '';
  const isAdmin = playerId === Object.keys(players)[0];

  if (gameOver) {
    return (
      <FimDeJogo 
        players={players}
        winner={gameWinner}
        onPlayAgain={resetGame}
        onExit={onExitGame}
      />
    );
  }

  return (
    <div className="jogo-do-numero">
      <h1 className="game-title">Jogo do Número</h1>
      {renderGameModeInfo()}

      {isLoading && <LoadingSpinner />}

      <div className="players-overview">
        {Object.values(players).map((player) => (
          <div 
            key={player.id} 
            className={`player-overview ${currentTurn === player.id ? 'current-turn' : ''} ${winners.includes(player.id) ? 'winner' : ''}`}
          >
            <div className="player-name">{player.name}</div>
            <div className="player-number">{player.number || '?'}</div>
            <div className="player-score">Pontos: {player.score || 0}</div>
            <div className="player-level">Nível: {player.level || 1}</div>
            <div className="player-multiplier">
              Multiplicador: {player.consecutiveHits === 1 ? '1x' :
                              player.consecutiveHits === 2 ? '1.5x' :
                              player.consecutiveHits === 3 ? '2x' : '3x'}
            </div>
            <div className="player-turn-info">
              {currentTurn === player.id ? 'Sua vez!' : 'Aguarde...'}
            </div>
          </div>
        ))}
      </div>

      {message && <p ref={messageRef} className="message">{message}</p>}
      {diceResult && (
        <div className="dice-result" ref={diceRef}>
          Resultado do dado: {diceResult}
        </div>
      )}

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
            disabled={hasSelectedNumber || isLoading}
          />
          <button type="submit" className="button" disabled={hasSelectedNumber || isLoading}>
            Confirmar Número
          </button>
        </form>

        <div className="action-buttons">
          {isPlayerTurn && (
            <button 
              onClick={rollDice} 
              className={`button roll-button ${isRolling ? 'dice-rolling' : ''}`}
              disabled={isRolling || isLoading}
            >
              {isRolling ? 'Rolando...' : 'Girar Dado'}
            </button>
          )}
          {isAdmin && (
            <button onClick={resetGame} className="button reset-button" disabled={isLoading}>
              Reiniciar Jogo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JogoDoNumero;