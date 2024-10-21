import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ref, onValue, push, set, update, remove, get } from 'firebase/database';
import { database } from './config/firebaseConfig';
import './App.css';
import EntradaJogador from './components/EntradaJogador/EntradaJogador';
import SalaDeEspera from './components/SalaDeEspera/SalaDeEspera';
import JogoDoNumero from './components/JogoDoNumero/JogoDoNumero';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState({});
  const [gameState, setGameState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (gameId) {
      const gameRef = ref(database, `games/${gameId}`);
      return onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameStarted(data.started || false);
          setPlayers(data.players || {});
          setGameState(data);
        }
      });
    }
  }, [gameId]);

  const createOrJoinGame = async (playerName, gameIdInput, action) => {
    let gameReference;
    let resultGameId;
    let newPlayerId;
  
    try {
      if (action === 'create') {
        gameReference = push(ref(database, 'games'));
        resultGameId = gameReference.key;
      } else {
        resultGameId = gameIdInput;
        gameReference = ref(database, `games/${resultGameId}`);
      }
  
      const newPlayerRef = push(ref(database, `games/${resultGameId}/players`));
      newPlayerId = newPlayerRef.key;
  
      const newPlayerData = {
        id: newPlayerId,
        name: playerName,
        score: 0,
        number: '',
        consecutiveHits: 0,
        level: 1
      };

      if (action === 'create') {
        await set(gameReference, {
          players: {
            [newPlayerId]: newPlayerData
          },
          started: false,
          currentTurn: newPlayerId,
          message: '',
          gameMode: 'normal',
          roundWins: {},
          gameOver: false
        });
      } else {
        await update(gameReference, {
          [`players/${newPlayerId}`]: newPlayerData
        });
      }
  
      setGameId(resultGameId);
      setPlayerId(newPlayerId);
      return resultGameId;
    } catch (error) {
      console.error('Erro em createOrJoinGame:', error);
      throw error;
    }
  };

  const startGame = async (gameMode) => {
    if (Object.keys(players).length >= 2) {
      try {
        const firstPlayerId = Object.keys(players)[0];
        await update(ref(database, `games/${gameId}`), { 
          started: true,
          currentTurn: firstPlayerId,
          message: `O jogo começou! É a vez de ${players[firstPlayerId].name} girar o dado.`,
          gameMode: gameMode,
          roundWins: {}
        });
      } catch (error) {
        console.error('Erro ao iniciar o jogo:', error);
      }
    } else {
      console.log("Não há jogadores suficientes para iniciar o jogo");
    }
  };

  const exitGame = async () => {
    try {
      if (gameId && playerId) {
        const gameRef = ref(database, `games/${gameId}`);
        const gameSnapshot = await get(gameRef);
        const gameData = gameSnapshot.val();

        if (gameData && gameData.players) {
          const updatedPlayers = { ...gameData.players };
          delete updatedPlayers[playerId];

          if (Object.keys(updatedPlayers).length === 0) {
            // Se não há mais jogadores, remove o jogo completamente
            await remove(gameRef);
          } else {
            // Se ainda há jogadores, atualiza a lista de jogadores
            await update(gameRef, { players: updatedPlayers });

            // Se o jogador que saiu era o atual, passa a vez para o próximo
            if (gameData.currentTurn === playerId) {
              const nextPlayerId = Object.keys(updatedPlayers)[0];
              await update(gameRef, { currentTurn: nextPlayerId });
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao sair do jogo:', error);
    } finally {
      setGameId(null);
      setPlayerId(null);
      setGameStarted(false);
      setPlayers({});
      setGameState({});
      navigate('/');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<EntradaJogador onAddPlayer={createOrJoinGame} />} />
      <Route 
        path="/sala-de-espera/:gameId" 
        element={
          gameId && playerId ? (
            gameStarted ? (
              <Navigate to={`/jogo/${gameId}`} replace />
            ) : (
              <SalaDeEspera 
                gameId={gameId} 
                players={players} 
                playerId={playerId} 
                onStartGame={startGame}
                onExitGame={exitGame}
              />
            )
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/jogo/:gameId" 
        element={
          gameStarted ? (
            <JogoDoNumero 
              gameState={gameState} 
              playerId={playerId} 
              database={database} 
              gameId={gameId}
              onExitGame={exitGame}
            />
          ) : (
            <Navigate to={`/sala-de-espera/${gameId}`} replace />
          )
        } 
      />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;