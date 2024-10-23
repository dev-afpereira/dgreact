import React from 'react';
import './QuickStats.css';

function QuickStats({ stats }) {
  const statsItems = [
    {
      id: 'gamesPlayed',
      label: 'Partidas',
      value: stats?.gamesPlayed || 0,
      icon: 'fas fa-gamepad'
    },
    {
      id: 'wins',
      label: 'Vitórias',
      value: stats?.wins || 0,
      icon: 'fas fa-trophy'
    },
    {
      id: 'winRate',
      label: 'Taxa de Vitória',
      value: `${((stats?.wins / stats?.gamesPlayed) * 100 || 0).toFixed(1)}%`,
      icon: 'fas fa-percentage'
    },
    {
      id: 'level',
      label: 'Nível',
      value: stats?.level || 1,
      icon: 'fas fa-star'
    }
  ];

  return (
    <div className="quick-stats">
      {statsItems.map(item => (
        <div key={item.id} className="stat-item">
          <div className="stat-icon">
            <i className={item.icon}></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuickStats;