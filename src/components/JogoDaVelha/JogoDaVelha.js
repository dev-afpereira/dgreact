import React, { useState, useEffect } from 'react';
import { ref, update, onValue } from 'firebase/database';
import './JogoDaVelha.css';
import Chat from '../Chat/Chat';

function JogoDaVelha({ playerId, database, gameId, onExitGame }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBoard(data.board || Array(9).fill(null));
        setCurrentPlayer(data.currentPlayer || 'X');
        setPlayers(data.players || {});
        setWinner(data.winner || null);
      }
    });
  }, [database, gameId]);

  const handleClick = async (index) => {
    if (board[index] || winner || isLoading) return;
    
    const playerSymbol = players[playerId]?.symbol;
    if (currentPlayer !== playerSymbol) return;

    setIsLoading(true);
    try {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;

      await update(ref(database, `games/${gameId}`), {
        board: newBoard,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X'
      });
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="jogo-da-velha-container">
      <div className="game-content">
        <h1>Jogo da Velha</h1>
        
        <div className="board">
          {board.map((square, index) => (
            <button
              key={index}
              className="square"
              onClick={() => handleClick(index)}
              disabled={isLoading}
            >
              {square}
            </button>
          ))}
        </div>

        <div className="game-info">
          {winner ? (
            <p>Vencedor: {winner}</p>
          ) : (
            <p>Jogador Atual: {currentPlayer}</p>
          )}
        </div>

        <button 
          onClick={onExitGame}
          className="exit-button"
          disabled={isLoading}
        >
          Sair do Jogo
        </button>
      </div>

      <div className="chat-container">
        <Chat
          gameId={gameId}
          playerId={playerId}
          playerName={players[playerId]?.name || ''}
          database={database}
        />
      </div>
    </div>
  );
}

export default JogoDaVelha; 