import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentMatches.css';

function RecentMatches({ matches = [], limit = 5 }) {
  const navigate = useNavigate();

  const getMatchResult = (match) => {
    if (match.type === 'tournament') {
      return match.position === 1 ? 'Campeão' : `${match.position}º lugar`;
    }
    return match.won ? 'Vitória' : 'Derrota';
  };

  const getResultClass = (match) => {
    if (match.type === 'tournament') {
      return match.position === 1 ? 'victory' : match.position <= 3 ? 'podium' : 'regular';
    }
    return match.won ? 'victory' : 'defeat';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="recent-matches">
      {matches && matches.length > 0 ? (
        <div className="matches-list">
          {matches.slice(0, limit).map((match) => (
            <div 
              key={match.id} 
              className={`match-card ${getResultClass(match)}`}
              onClick={() => navigate(`/matches/${match.id}`)}
            >
              <div className="match-header">
                <div className="match-mode">
                  <i className={`fas fa-${match.type === 'tournament' ? 'trophy' : 'gamepad'}`}></i>
                  <span>{match.gameMode}</span>
                </div>
                <span className="match-date">
                  {new Date(match.date).toLocaleDateString()}
                </span>
              </div>

              <div className="match-details">
                <div className="match-result">
                  <span className="result-badge">
                    {getMatchResult(match)}
                  </span>
                  <span className="match-score">
                    {match.score} pontos
                  </span>
                </div>

                <div className="match-stats">
                  <div className="stat">
                    <i className="fas fa-bullseye"></i>
                    <span>{match.accuracy}% precisão</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-clock"></i>
                    <span>{formatDuration(match.duration)}</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-users"></i>
                    <span>{match.players.length} jogadores</span>
                  </div>
                </div>

                {match.achievement && (
                  <div className="match-achievement">
                    <i className="fas fa-star"></i>
                    <span>{match.achievement}</span>
                  </div>
                )}
              </div>

              <div className="match-players">
                <div className="players-list">
                  {match.players.slice(0, 3).map((player, index) => (
                    <div key={player.id} className="player-tag">
                      {player.name}
                    </div>
                  ))}
                  {match.players.length > 3 && (
                    <div className="player-tag more">
                      +{match.players.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-matches">
          <i className="fas fa-dice-d6"></i>
          <p>Nenhuma partida jogada ainda</p>
          <button 
            className="play-now-button"
            onClick={() => navigate('/games')}
          >
            Jogar Agora
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentMatches;