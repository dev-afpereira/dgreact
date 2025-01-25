import React, { useState, useEffect } from 'react';
import { ref, update, onValue } from 'firebase/database';
import './JogoDaForca.css';
import Chat from '../Chat/Chat';

function JogoDaForca({ playerId, database, gameId, onExitGame }) {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [players, setPlayers] = useState({});
  const [currentTurn, setCurrentTurn] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [isLoading, setIsLoading] = useState(false);

  const maxWrongGuesses = 6;

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    return onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWord(data.word || '');
        setGuessedLetters(data.guessedLetters || []);
        setWrongGuesses(data.wrongGuesses || 0);
        setPlayers(data.players || {});
        setCurrentTurn(data.currentTurn || '');
        setGameStatus(data.gameStatus || 'playing');
      }
    });
  }, [database, gameId]);

  const isPlayerTurn = currentTurn === playerId;

  const handleLetterGuess = async (letter) => {
    if (!isPlayerTurn || isLoading || gameStatus !== 'playing') return;

    setIsLoading(true);
    try {
      const newGuessedLetters = [...guessedLetters, letter];
      const newWrongGuesses = word.includes(letter) 
        ? wrongGuesses 
        : wrongGuesses + 1;

      const playerIds = Object.keys(players);
      const nextPlayerIndex = (playerIds.indexOf(currentTurn) + 1) % playerIds.length;
      const nextPlayerId = playerIds[nextPlayerIndex];

      let newGameStatus = 'playing';
      if (newWrongGuesses >= maxWrongGuesses) {
        newGameStatus = 'lost';
      } else if (word.split('').every(letter => newGuessedLetters.includes(letter))) {
        newGameStatus = 'won';
      }

      await update(ref(database, `games/${gameId}`), {
        guessedLetters: newGuessedLetters,
        wrongGuesses: newWrongGuesses,
        currentTurn: nextPlayerId,
        gameStatus: newGameStatus
      });
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayWord = word
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="forca-container">
      <div className="game-content">
        <h1>Jogo da Forca</h1>

        <div className="hangman-display">
          {/* Aqui você pode adicionar o desenho da forca baseado em wrongGuesses */}
          <div className="hangman-figure">
            Erros: {wrongGuesses} / {maxWrongGuesses}
          </div>
        </div>

        <div className="word-display">
          <h2>{displayWord}</h2>
        </div>

        <div className="game-status">
          {gameStatus === 'won' && <p>Parabéns! Você venceu!</p>}
          {gameStatus === 'lost' && <p>Game Over! A palavra era: {word}</p>}
          {gameStatus === 'playing' && (
            <p>{isPlayerTurn ? 'Sua vez!' : 'Aguarde sua vez...'}</p>
          )}
        </div>

        <div className="letter-buttons">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterGuess(letter)}
              disabled={
                guessedLetters.includes(letter) ||
                !isPlayerTurn ||
                gameStatus !== 'playing' ||
                isLoading
              }
              className="letter-button"
            >
              {letter}
            </button>
          ))}
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

export default JogoDaForca; 