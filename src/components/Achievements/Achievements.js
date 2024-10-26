import React, { useState } from 'react';

import './Achievements.css';

function Achievements() {
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Todas', icon: 'fas fa-trophy' },
    { id: 'gameplay', name: 'Jogabilidade', icon: 'fas fa-gamepad' },
    { id: 'social', name: 'Social', icon: 'fas fa-users' },
    { id: 'special', name: 'Especiais', icon: 'fas fa-star' },
    { id: 'collection', name: 'Coleção', icon: 'fas fa-layer-group' }
  ];

  const achievements = [
    {
      id: 'first_win',
      name: 'Primeira Vitória',
      description: 'Vença sua primeira partida',
      icon: '🏆',
      category: 'gameplay',
      rarity: 'common',
      points: 100,
      progress: { current: 1, total: 1 },
      unlocked: true,
      unlockedAt: '2024-01-01'
    },
    {
      id: 'winning_streak',
      name: 'Sequência Vencedora',
      description: 'Vença 3 partidas seguidas',
      icon: '🔥',
      category: 'gameplay',
      rarity: 'rare',
      points: 250,
      progress: { current: 2, total: 3 },
      unlocked: false
    },
    {
      id: 'social_butterfly',
      name: 'Borboleta Social',
      description: 'Jogue partidas com 10 jogadores diferentes',
      icon: '🦋',
      category: 'social',
      rarity: 'epic',
      points: 500,
      progress: { current: 7, total: 10 },
      unlocked: false
    },
    // Adicione mais conquistas aqui
  ];

  const filteredAchievements = achievements
    .filter(achievement => 
      (activeCategory === 'all' || achievement.category === activeCategory) &&
      (achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       achievement.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    points: achievements.reduce((sum, a) => a.unlocked ? sum + a.points : sum, 0),
    totalPoints: achievements.reduce((sum, a) => sum + a.points, 0)
  };

  return (
    <div className="achievements-container">
      {/* Header com estatísticas */}
      <div className="achievements-header">
        <h1>Conquistas</h1>
        <div className="achievement-stats">
          <div className="stat">
            <span className="stat-value">{stats.unlocked}/{stats.total}</span>
            <span className="stat-label">Conquistas</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.points}</span>
            <span className="stat-label">Pontos</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {Math.round((stats.unlocked / stats.total) * 100)}%
            </span>
            <span className="stat-label">Completado</span>
          </div>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="achievements-filters">
        <div className="categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pesquisar conquistas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>
      </div>

      {/* Lista de Conquistas */}
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.rarity} ${achievement.unlocked ? 'unlocked' : ''}`}
          >
            <div className="achievement-icon">
              {achievement.icon}
            </div>
            <div className="achievement-content">
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
              
              {achievement.progress && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {achievement.progress.current}/{achievement.progress.total}
                  </span>
                </div>
              )}

              <div className="achievement-footer">
                <span className="achievement-points">
                  <i className="fas fa-star"></i>
                  {achievement.points} pontos
                </span>
                <span className={`achievement-rarity ${achievement.rarity}`}>
                  {achievement.rarity}
                </span>
              </div>

              {achievement.unlocked && (
                <div className="unlocked-date">
                  Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;