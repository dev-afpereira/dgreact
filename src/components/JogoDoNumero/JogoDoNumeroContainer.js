// components/JogoDoNumero/JogoDoNumeroContainer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../config/firebaseConfig'; // Corrigido o caminho da importação
import JogoDoNumero from './JogoDoNumero';

function JogoDoNumeroContainer() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameData(data);
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  const handleExitGame = async () => {
    try {
      // Lógica para sair do jogo
      navigate('/games'); // ou para onde você quiser redirecionar
    } catch (error) {
      console.error('Erro ao sair do jogo:', error);
    }
  };

  if (!gameData) {
    return <div>Carregando...</div>;
  }

  return (
    <JogoDoNumero
      gameId={gameId}
      playerId={currentUser.uid}
      gameData={gameData}
      onExitGame={handleExitGame}
    />
  );
}

export default JogoDoNumeroContainer;