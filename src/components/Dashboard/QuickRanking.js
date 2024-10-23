import React, { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './QuickRanking.css';

function QuickRanking({ database, currentPlayerId }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar top 5 jogadores
    const rankingRef = ref(database, 'players');
    const topPlayersQuery = query(
      rankingRef,
      orderByChild('score'),
      limitToLast(5)
    );

    const unsubscribe = onValue(topPlayersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const players = [];
        snapshot.forEach((childSnapshot) => {
          players.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });

        // Ordenar jogadores por pontuação em ordem decrescente
        const sortedPlayers = players.sort((a, b) => b.score - a.score);
        setTopPlayers(sortedPlayers);

        // Encontrar rank do jogador atual
        if (currentPlayerId) {
          const playerData = players.find(p => p.id === currentPlayerId);
          if (playerData) {
            const rank = players.findIndex(p => p.id === currentPlayerId) + 1;
            setPlayerRank({
              ...playerData,
              rank
            });
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [database, currentPlayerId]);

  const getRankDisplay = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getPlayerTrend = (player) => {
    const rankChange = player.previousRank - player.currentRank;
    if (rankChange > 0) return 'up';
    if (rankChange < 0) return 'down';
    return 'stable';
  };

  if (loading) {
    return (
      <div className="quick-ranking loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="quick-ranking">
      <div className="ranking-section">
        <h3>Top Jogadores</h3>
        <div className="top-players">
          {topPlayers.map((player, index) => (
            <div 
              key={player.id}
              className={`player-rank ${player.id === currentPlayerId ? 'current' : ''}`}
            >
              <div className="rank-position">
                <span className="rank-number">{getRankDisplay(index)}</span>
                {player.rankChange && (
                  <span className={`rank-trend ${getPlayerTrend(player)}`}>
                    <i className={`fas fa-arrow-${getPlayerTrend(player)}`}></i>
                  </span>
                )}
              </div>
              
              <div className="player-info">
                <div className="player-avatar">
                  <img 
                    src={player.avatar || '/default-avatar.png'} 
                    alt={player.username} 
                  />
                  <span className={`status-indicator ${player.online ? 'online' : 'offline'}`}></span>
                </div>
                <div className="player-details">
                  <span className="player-name">
                    {player.username}
                    {player.title && (
                      <span className="player-title">{player.title}</span>
                    )}
                  </span>
                  <span className="player-level">Nível {player.level}</span>
                </div>
              </div>

              <div className="player-stats">
                <div className="stat">
                  <span className="stat-value">{player.score}</span>
                  <span className="stat-label">Pontos</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{player.winRate}%</span>
                  <span className="stat-label">Vitórias</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {playerRank && playerRank.rank > 5 && (
        <div className="current-player-rank">
          <div className="rank-divider">
            <span>•••</span>
          </div>
          <div className="player-rank current">
            <div className="rank-position">
              <span className="rank-number">#{playerRank.rank}</span>
            </div>
            <div className="player-info">
              <div className="player-avatar">
                <img 
                  src={playerRank.avatar || '/default-avatar.png'} 
                  alt={playerRank.username} 
                />
                <span className="status-indicator online"></span>
              </div>
              <div className="player-details">
                <span className="player-name">
                  Você
                  {playerRank.title && (
                    <span className="player-title">{playerRank.title}</span>
                  )}
                </span>
                <span className="player-level">Nível {playerRank.level}</span>
              </div>
            </div>
            <div className="player-stats">
              <div className="stat">
                <span className="stat-value">{playerRank.score}</span>
                <span className="stat-label">Pontos</span>
              </div>
              <div className="stat">
                <span className="stat-value">{playerRank.winRate}%</span>
                <span className="stat-label">Vitórias</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        className="view-full-ranking"
        onClick={() => navigate('/ranking')}
      >
        Ver Ranking Completo
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default QuickRanking;