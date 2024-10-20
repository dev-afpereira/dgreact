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
  const startGame = async () => {
    if (players.length >= 2) {
      await update(ref(database, `games/${gameId}`), { started: true });
    } else {
      console.log("Não há jogadores suficientes para iniciar o jogo");
    }
  
  };

  useEffect(() => {
    if (gameId) {
      const gameRef = ref(database, `games/${gameId}`);
      onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameStarted(data.started || false);
          setPlayers(Object.values(data.players || {}));
          setGameState(data);
        }
      });
    }
  }, [gameId]);

  const createOrJoinGame = async (playerName, gameIdInput, action) => {
    console.log('createOrJoinGame chamado:', playerName, gameIdInput, action);
    let gameReference;
    let resultGameId;
  
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
      console.log('Tentando adicionar jogador ao Firebase');
      await set(newPlayerRef, {
        id: newPlayerRef.key,
        name: playerName,
        score: 0,
        number: ''
      });
      console.log('Jogador adicionado com sucesso');
  
      setGameId(resultGameId);
      setPlayerId(newPlayerRef.key);
      console.log('GameId e PlayerId atualizados:', resultGameId, newPlayerRef.key);
  
      return resultGameId;
    } catch (error) {
      console.error('Erro em createOrJoinGame:', error);
      throw error;
    }
  };

  const SalaDeEsperaWrapper = () => {
    return gameId && playerId ? (
      <SalaDeEspera 
        gameId={gameId} 
        players={players} 
        playerId={playerId} 
        onStartGame={startGame}
      />
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<EntradaJogador onAddPlayer={createOrJoinGame} />} />
      <Route path="/sala-de-espera/:gameId" element={<SalaDeEsperaWrapper />} />
        <Route 
          path="/jogo/:gameId" 
          element={
            gameId && playerId && gameStarted ? (
              <JogoDoNumero 
                gameState={gameState} 
                playerId={playerId} 
                database={database} 
                gameId={gameId}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;