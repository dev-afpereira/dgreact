// components/SalaDeEspera/SalaDeEsperaContainer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../config/firebaseConfig'; // Corrigido o caminho da importação
import SalaDeEspera from './SalaDeEspera';

function SalaDeEsperaContainer() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setPlayers(gameData.players || {});
        
        if (gameData.status === 'started') {
          navigate(`/jogo/${gameId}`);
        }
      }
    });

    return () => unsubscribe();
  }, [gameId, navigate]);

  const handleStartGame = async (gameMode) => {
    try {
      await update(ref(database, `games/${gameId}`), {
        status: 'started',
        gameMode: gameMode,
        currentTurn: Object.keys(players)[0],
        message: 'O jogo começou!'
      });
      
      navigate(`/jogo/${gameId}`);
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
    }
  };

  return (
    <SalaDeEspera
      gameId={gameId}
      players={players}
      playerId={currentUser.uid}
      onStartGame={handleStartGame}
    />
  );
}

export default SalaDeEsperaContainer;