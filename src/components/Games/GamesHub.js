import React, { useState,} from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../Dashboard/GameCard'; // Ajustando o caminho
import RecentMatches from '../Dashboard/RecentMatches';
import './GamesHub.css';

function GamesHub() {
  const [games] = useState([
    {
      id: 'numero',
      title: 'Jogo do Número',
      description: 'Teste sua sorte e estratégia neste jogo de adivinhação!',
      image: '/games/numero.jpg',
      onlinePlayers: 0,
      activeGames: 0,
      modes: [
        {
          id: 'normal',
          name: 'Normal',
          description: 'Modo clássico do jogo',
          players: '2-8 jogadores'
        },
        {
          id: 'bestOfThree',
          name: 'Melhor de 3',
          description: 'Vença 3 rodadas para ganhar',
          players: '2-4 jogadores'
        }
      ]
    }
    // Adicione mais jogos aqui quando disponíveis
  ]);

  const navigate = useNavigate();

  const handlePlayGame = (gameId, modeId) => {
    navigate(`/sala-de-espera/${gameId}`);
  };

  return (
    <div className="games-hub">
      <header className="games-hub-header">
        <h1>Central de Jogos</h1>
        <div className="games-stats">
          <div className="stat">
            <i className="fas fa-users"></i>
            <span>Jogadores Online: {games.reduce((sum, game) => sum + game.onlinePlayers, 0)}</span>
          </div>
          <div className="stat">
            <i className="fas fa-gamepad"></i>
            <span>Partidas Ativas: {games.reduce((sum, game) => sum + game.activeGames, 0)}</span>
          </div>
        </div>
      </header>

      <div className="games-grid">
        {games.map(game => (
          <GameCard 
            key={game.id}
            game={game}
            onPlay={(modeId) => handlePlayGame(game.id, modeId)}
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