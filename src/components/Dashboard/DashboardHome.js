
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Trophy, 
  Target, 
  Star,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight 
} from 'lucide-react';
import './DashboardHome.css';

function DashboardHome() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const statsCards = [
    {
      icon: Target,
      label: 'Partidas',
      value: userProfile?.stats?.gamesPlayed || 0,
      color: '#2563eb'
    },
    {
      icon: Trophy,
      label: 'Vitórias',
      value: userProfile?.stats?.wins || 0,
      color: '#f59e0b'
    },
    {
      icon: Star,
      label: 'Taxa de Vitória',
      value: `${userProfile?.stats?.winRate || 0}%`,
      color: '#10b981'
    },
    {
      icon: TrendingUp,
      label: 'Pontuação Total',
      value: userProfile?.stats?.totalScore || 0,
      color: '#8b5cf6'
    }
  ];

  const activities = [
    // Aqui você pode adicionar as atividades recentes do usuário
    // vindas do banco de dados
  ];

  const dailyTasks = [
    {
      title: 'Primeira Vitória do Dia',
      reward: '100 pontos',
      progress: userProfile?.dailyTasks?.firstWin ? 100 : 0,
      completed: userProfile?.dailyTasks?.firstWin || false
    },
    {
      title: 'Jogar 3 Partidas',
      reward: '150 pontos',
      progress: ((userProfile?.dailyTasks?.gamesPlayed || 0) / 3) * 100,
      completed: (userProfile?.dailyTasks?.gamesPlayed || 0) >= 3
    },
    {
      title: 'Acertar 5 Números',
      reward: '200 pontos',
      progress: ((userProfile?.dailyTasks?.correctGuesses || 0) / 5) * 100,
      completed: (userProfile?.dailyTasks?.correctGuesses || 0) >= 5
    }
  ];

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h2>Olá, {userProfile?.username || 'Jogador'}! 👋</h2>
          <p>Bem-vindo de volta ao Jogo do Número</p>
        </div>
        <button 
          className="play-button"
          onClick={() => navigate('/games')}
        >
          Jogar Agora
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div 
                className="stat-icon" 
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon size={24} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Daily Tasks */}
        <section className="tasks-section">
          <div className="section-header">
            <h3>
              <Calendar size={20} />
              Tarefas Diárias
            </h3>
            <span className="completion-text">
              {dailyTasks.filter(task => task.completed).length}/{dailyTasks.length} Completadas
            </span>
          </div>
          <div className="tasks-list">
            {dailyTasks.map((task, index) => (
              <div key={index} className="task-card">
                <div className="task-info">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span className="task-reward">{task.reward}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
                {task.completed && (
                  <div className="task-complete">
                    <Trophy size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="activity-section">
          <div className="section-header">
            <h3>
              <Clock size={20} />
              Atividade Recente
            </h3>
            <button 
              className="view-all"
              onClick={() => navigate('/profile')}
            >
              Ver Tudo
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="activity-card">
                  {/* Renderizar atividades aqui */}
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>Nenhuma atividade recente</p>
                <button 
                  className="start-playing"
                  onClick={() => navigate('/games')}
                >
                  Começar a Jogar
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardHome;