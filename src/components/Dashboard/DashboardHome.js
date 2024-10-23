import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import GameCard from './GameCard';
import QuickStats from './QuickStats';
import RecentMatches from './RecentMatches';
import RecentAchievements from './RecentAchievements';
import QuickRanking from './QuickRanking';
import './DashboardHome.css';

function DashboardHome() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const games = [
    {
      id: 'numero',
      title: 'Jogo do Número',
      description: 'Teste sua sorte e estratégia neste jogo de adivinhação!',
      image: '/games/numero.jpg',
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
        },
        {
          id: 'tournament',
          name: 'Torneio',
          description: 'Competição eliminatória',
          players: '8-16 jogadores',
          special: true
        }
      ]
    },
    // Adicione mais jogos aqui quando disponíveis
  ];

  const announcements = [
    {
      id: 1,
      type: 'update',
      title: 'Novo Modo de Jogo!',
      message: 'Experimente o novo modo Torneio no Jogo do Número',
      date: new Date(),
      action: () => navigate('/games/numero/tournament')
    },
    {
      id: 2,
      type: 'event',
      title: 'Torneio Semanal',
      message: 'Inscrições abertas para o torneio desta semana',
      date: new Date(),
      action: () => navigate('/tournaments')
    }
  ];

  const dailyTasks = [
    {
      id: 1,
      title: 'Primeira Vitória do Dia',
      progress: userProfile?.dailyTasks?.firstWin ? 100 : 0,
      reward: '100 pontos'
    },
    {
      id: 2,
      title: 'Jogar 3 Partidas',
      progress: ((userProfile?.dailyTasks?.gamesPlayed || 0) / 3) * 100,
      reward: '150 pontos'
    },
    {
      id: 3,
      title: 'Acertar 5 Números',
      progress: ((userProfile?.dailyTasks?.correctGuesses || 0) / 5) * 100,
      reward: '200 pontos'
    }
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home">
        {/* Seção de Boas-vindas */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Bem-vindo, {userProfile?.username}!</h1>
            <p className="last-seen">
              Última visita: {new Date(userProfile?.lastSeen).toLocaleDateString()}
            </p>
          </div>
          <QuickStats stats={userProfile?.stats} />
        </section>

        {/* Anúncios e Tarefas Diárias */}
        <div className="dashboard-grid">
          <section className="announcements-section">
            <h2>Novidades</h2>
            <div className="announcements-list">
              {announcements.map(announcement => (
                <div 
                  key={announcement.id} 
                  className={`announcement-card ${announcement.type}`}
                  onClick={announcement.action}
                >
                  <div className="announcement-header">
                    <span className="announcement-type">{announcement.type}</span>
                    <span className="announcement-date">
                      {announcement.date.toLocaleDateString()}
                    </span>
                  </div>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.message}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="daily-tasks-section">
            <h2>Tarefas Diárias</h2>
            <div className="daily-tasks-list">
              {dailyTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <span className="task-reward">{task.reward}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {task.progress}% completo
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Jogos Disponíveis */}
        <section className="games-section">
          <div className="section-header">
            <h2>Jogos Disponíveis</h2>
            <button 
              className="view-all-button"
              onClick={() => navigate('/games')}
            >
              Ver Todos
            </button>
          </div>
          <div className="games-grid">
            {games.map(game => (
              <GameCard 
                key={game.id}
                game={game}
                onPlay={(modeId) => navigate(`/games/${game.id}/${modeId}`)}
              />
            ))}
          </div>
        </section>

        {/* Última Atividade */}
        <div className="dashboard-grid">
          <section className="recent-matches-section">
            <div className="section-header">
              <h2>Últimas Partidas</h2>
              <button 
                className="view-all-button"
                onClick={() => navigate('/matches/history')}
              >
                Ver Histórico
              </button>
            </div>
            <RecentMatches 
              matches={userProfile?.recentMatches} 
              limit={5}
            />
          </section>

          <section className="recent-achievements-section">
            <div className="section-header">
              <h2>Conquistas Recentes</h2>
              <button 
                className="view-all-button"
                onClick={() => navigate('/achievements')}
              >
                Ver Todas
              </button>
            </div>
            <RecentAchievements 
              achievements={userProfile?.recentAchievements}
              limit={3}
            />
          </section>
        </div>

        {/* Ranking Rápido */}
        <section className="quick-ranking-section">
          <div className="section-header">
            <h2>Sua Posição no Ranking</h2>
            <button 
              className="view-all-button"
              onClick={() => navigate('/ranking')}
            >
              Ver Ranking Completo
            </button>
          </div>
          <QuickRanking 
            currentPlayerId={userProfile?.id}
            ranking={userProfile?.ranking}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}

export default DashboardHome;