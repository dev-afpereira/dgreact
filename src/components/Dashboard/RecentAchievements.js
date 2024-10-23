import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentAchievements.css';

function RecentAchievements({ achievements = [], limit = 3 }) {
  const navigate = useNavigate();

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'var(--achievement-common)';
      case 'rare': return 'var(--achievement-rare)';
      case 'epic': return 'var(--achievement-epic)';
      case 'legendary': return 'var(--achievement-legendary)';
      default: return 'var(--achievement-common)';
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return 'Comum';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Lendário';
      default: return 'Comum';
    }
  };

  const getProgressPercentage = (current, total) => {
    return Math.min((current / total) * 100, 100);
  };

  return (
    <div className="recent-achievements">
      {achievements && achievements.length > 0 ? (
        <div className="achievements-list">
          {achievements.slice(0, limit).map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.rarity}`}
              style={{ '--rarity-color': getRarityColor(achievement.rarity) }}
              onClick={() => navigate(`/achievements/${achievement.id}`)}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              
              <div className="achievement-content">
                <div className="achievement-header">
                  <h4>{achievement.name}</h4>
                  <span className="achievement-rarity">
                    {getRarityLabel(achievement.rarity)}
                  </span>
                </div>
                
                <p className="achievement-description">
                  {achievement.description}
                </p>
                
                {achievement.progress && (
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage(achievement.progress.current, achievement.progress.total)}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {achievement.progress.current}/{achievement.progress.total}
                    </span>
                  </div>
                )}

                {achievement.reward && (
                  <div className="achievement-reward">
                    <i className="fas fa-gift"></i>
                    <span>{achievement.reward}</span>
                  </div>
                )}

                {achievement.unlockedAt && (
                  <div className="achievement-date">
                    Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {achievement.new && (
                <div className="new-badge">
                  Novo!
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-achievements">
          <i className="fas fa-trophy"></i>
          <p>Nenhuma conquista desbloqueada ainda</p>
          <button 
            className="view-all-button"
            onClick={() => navigate('/achievements')}
          >
            Ver Todas as Conquistas
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentAchievements;