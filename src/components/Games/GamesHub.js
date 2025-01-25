import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import GameCard from '../Dashboard/GameCard';
import RecentMatches from '../Dashboard/RecentMatches';
import { database } from '../../config/firebaseConfig';
import './GamesHub.css';

function GamesHub() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const gamesRef = ref(database, 'games');
    const unsubscribe = onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const gamesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          onlinePlayers: 0,
          activeGames: 0,
          image: getGameImage(key),
        }));
        setGames(gamesArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const getGameImage = (gameId) => {
    const gameImages = {
      'jogo-da-velha': '/images/jogo-da-velha.png',
      'forca': '/images/forca.png',
      'jogo-do-numero': '/images/jogo-do-numero.png'
    };
    return gameImages[gameId] || '/images/default-game.png';
  };

  const handlePlayGame = (gameId) => {
    navigate(`/sala-de-espera/${gameId}`);
  };

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="games-hub">
      <header className="games-hub-header">
        <h1>Central de Jogos</h1>
        <input
          type="text"
          placeholder="Filtrar jogos..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
        <div className="games-stats">
          <div className="stat">
            <i className="fas fa-users"></i>
            <span>Jogadores Online: {games.reduce((sum, game) => sum + (game.onlinePlayers || 0), 0)}</span>
          </div>
          <div className="stat">
            <i className="fas fa-gamepad"></i>
            <span>Partidas Ativas: {games.reduce((sum, game) => sum + (game.activeGames || 0), 0)}</span>
          </div>
        </div>
      </header>

      <div className="games-grid">
        {filteredGames.map(game => (
          <GameCard 
            key={game.id}
            game={{
              ...game,
              title: game.name,
              description: game.description,
              players: `${game.minPlayers}-${game.maxPlayers} jogadores`,
              imageUrl: game.image
            }}
            onPlay={() => handlePlayGame(game.id)}
          />
        ))}
      </div>

      <section className="recent-activity">
        <h2>Atividade Recente</h2>
        <RecentMatches limit={3} />
      </section>
    </div>
  );
}

export default GamesHub;