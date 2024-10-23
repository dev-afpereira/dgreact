import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

function Dashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const gameOptions = [
    {
      id: 'numero',
      title: 'Jogo do Número',
      description: 'Teste sua sorte e estratégia!',
      modes: [
        { id: 'normal', name: 'Normal', description: 'Modo clássico do jogo' },
        { id: 'bestOfThree', name: 'Melhor de 3', description: 'Vença 3 rodadas primeiro' }
      ]
    },
    // Adicione mais jogos aqui quando disponíveis
  ];

  const startGame = (gameId, mode) => {
    // Lógica para iniciar ou juntar-se a um jogo
    navigate(`/games/${gameId}/${mode}`);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-home">
        {/* Seção de Boas-vindas */}
        <section className="welcome-section">
          <h1>Bem-vindo, {userProfile?.username}!</h1>
          <div className="quick-stats">
            <div className="stat-card">
              <span className="stat-value">{userProfile?.stats?.gamesPlayed || 0}</span>
              <span className="stat-label">Partidas Jogadas</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{userProfile?.stats?.wins || 0}</span>
              <span className="stat-label">Vitórias</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{userProfile?.level || 1}</span>
              <span className="stat-label">Nível Atual</span>
            </div>
          </div>
        </section>

        {/* Seção de Jogos */}
        <section className="games-section">
          <h2>Jogos Disponíveis</h2>
          <div className="games-grid">
            {gameOptions.map(game => (
              <div key={game.id} className="game-card">
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <div className="game-modes">
                  {game.modes.map(mode => (
                    <button
                      key={mode.id}
                      className="mode-button"
                      onClick={() => startGame(game.id, mode.id)}
                    >
                      {mode.name}
                      <span className="mode-description">{mode.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de Conquistas Recentes */}
        <section className="recent-achievements">
          <h2>Conquistas Recentes</h2>
          <div className="achievements-list">
            {userProfile?.recentAchievements?.slice(0, 3).map(achievement => (
              <div key={achievement.id} className="achievement-card">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de Ranking Rápido */}
        <section className="quick-ranking">
          <h2>Sua Posição no Ranking</h2>
          <div className="ranking-preview">
            <div className="ranking-position">
              <span className="position-number">#{userProfile?.ranking?.position || '---'}</span>
              <span className="total-players">de {userProfile?.ranking?.totalPlayers || '---'} jogadores</span>
            </div>
            <button 
              className="view-ranking-button"
              onClick={() => navigate('/dashboard/ranking')}
            >
              Ver Ranking Completo
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;