import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ref, onValue, push, set, update } from 'firebase/database';
import { database } from './config/firebaseConfig';
import './App.css';
import EntradaJogador from './components/EntradaJogador/EntradaJogador';
import SalaDeEspera from './components/SalaDeEspera/SalaDeEspera';
import JogoDoNumero from './components/JogoDoNumero/JogoDoNumero';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    console.log('App montado ou gameId mudou:', gameId);
    if (gameId) {
      const gameRef = ref(database, `games/${gameId}`);
      return onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log('Dados do jogo atualizados:', data);
          setGameStarted(data.started || false);
          setPlayers(Object.values(data.players || {}));
          setGameState(data);
        }
      }, (error) => {
        console.error('Erro ao ler dados do Firebase:', error);
      });
    }
  }, [gameId]);

  useEffect(() => {
    console.log('gameStarted mudou para:', gameStarted);
  }, [gameStarted]);

  const createOrJoinGame = async (playerName, gameIdInput, action) => {
    console.log('createOrJoinGame chamado:', playerName, gameIdInput, action);
    let gameReference;
    let resultGameId;
    let newPlayerId;
  
    try {
      if (action === 'create') {
        gameReference = push(ref(database, 'games'));
        resultGameId = gameReference.key;
        console.log('Novo jogo criado:', resultGameId);
      } else {
        resultGameId = gameIdInput;
        gameReference = ref(database, `games/${resultGameId}`);
        console.log('Juntando-se ao jogo:', resultGameId);
      }
  
      const newPlayerRef = push(ref(database, `games/${resultGameId}/players`));
      newPlayerId = newPlayerRef.key;
  
      if (action === 'create') {
        await set(gameReference, {
          players: {
            [newPlayerId]: {
              id: newPlayerId,
              name: playerName,
              score: 0,
              number: ''
            }
          },
          started: false,
          currentTurn: newPlayerId,
          message: ''
        });
      } else {
        // Adicionar o jogador ao jogo existente
        await update(gameReference, {
          [`players/${newPlayerId}`]: {
            id: newPlayerId,
            name: playerName,
            score: 0,
            number: ''
          }
        });
      }
  
      console.log('Jogador adicionado com sucesso');
      setGameId(resultGameId);
      setPlayerId(newPlayerId);
      return resultGameId;
    } catch (error) {
      console.error('Erro em createOrJoinGame:', error);
      throw error;
    }
  };

  const startGame = async () => {
    console.log('startGame chamado');
    if (players.length >= 2) {
      try {
        const firstPlayerId = players[0].id;
        await update(ref(database, `games/${gameId}`), { 
          started: true,
          currentTurn: firstPlayerId,
          message: `O jogo começou! É a vez de ${players[0].name} girar o dado.`
        });
        console.log('Jogo iniciado com sucesso no Firebase');
      } catch (error) {
        console.error('Erro ao iniciar o jogo:', error);
      }
    } else {
      console.log("Não há jogadores suficientes para iniciar o jogo");
    }
  };

  console.log('Renderizando App com:', { gameId, playerId, gameStarted });

  return (
    <Router>
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
              />
            ) : (
              <Navigate to={`/sala-de-espera/${gameId}`} replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;