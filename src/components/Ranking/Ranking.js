import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { database } from '../../config/firebaseConfig';
import { Medal, ChevronUp, ChevronDown, Minus, Crown, Award, Target } from 'lucide-react';
import './Ranking.css';

function Ranking() {
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState([]);
  const [timeFrame, setTimeFrame] = useState('all'); // all, weekly, monthly
  const [currentPage, setCurrentPage] = useState(0);
  const playersPerPage = 10;

  useEffect(() => {
    const rankingRef = ref(database, 'players');
    const rankingQuery = query(rankingRef, orderByChild('score'));

    const unsubscribe = onValue(rankingQuery, (snapshot) => {
      if (snapshot.exists()) {
        const playersData = [];
        snapshot.forEach((childSnapshot) => {
          const player = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
          };
          playersData.push(player);
        });

        // Ordenar por pontuação (decrescente)
        const sortedPlayers = playersData.sort((a, b) => b.score - a.score);
        setPlayers(sortedPlayers);
      }
     
    });

    return () => unsubscribe();
  }, [timeFrame]);

  const getRankChange = (player) => {
    const change = (player.previousRank || 0) - player.currentRank;
    if (change > 0) return { icon: <ChevronUp className="text-green-500" />, value: change };
    if (change < 0) return { icon: <ChevronDown className="text-red-500" />, value: Math.abs(change) };
    return { icon: <Minus className="text-gray-400" />, value: 0 };
  };

  const getPlayerPosition = (player) => {
    return players.findIndex(p => p.id === player.id) + 1;
  };

  

  // Paginação
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(players.length / playersPerPage);

  return (
    <div className="ranking-container">
      {/* Cabeçalho com Filtros */}
      <div className="ranking-header">
        <h1>Ranking</h1>
        <div className="time-filters">
          <button
            className={`filter-button ${timeFrame === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFrame('all')}
          >
            Geral
          </button>
          <button
            className={`filter-button ${timeFrame === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeFrame('monthly')}
          >
            Mensal
          </button>
          <button
            className={`filter-button ${timeFrame === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeFrame('weekly')}
          >
            Semanal
          </button>
        </div>
      </div>

      {/* Cards de Destaque (Top 3) */}
      <div className="top-players">
        {players.slice(0, 3).map((player, index) => (
          <div 
            key={player.id} 
            className={`top-player-card ${index === 0 ? 'first' : ''}`}
          >
            <div className="position-indicator">
              {index === 0 ? (
                <Crown className="w-6 h-6 text-yellow-500" />
              ) : index === 1 ? (
                <Medal className="w-6 h-6 text-gray-400" />
              ) : (
                <Award className="w-6 h-6 text-amber-700" />
              )}
              #{index + 1}
            </div>
            <div className="player-avatar">
              <img 
                src={player.photoURL || '/default-avatar.png'} 
                alt={player.username}
                className="rounded-full w-16 h-16 object-cover"
              />
            </div>
            <div className="player-info">
              <h3>{player.username}</h3>
              <div className="player-stats">
                <span className="level">Nível {player.level}</span>
                <span className="score">{player.score} pts</span>
                <span className="winrate">{player.winRate}% vitórias</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de Classificação */}
      <div className="ranking-table-container">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Jogador</th>
              <th>Nível</th>
              <th>Pontuação</th>
              <th>Vitórias</th>
              <th>Taxa de Vitória</th>
              <th>Variação</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map((player) => {
              const position = getPlayerPosition(player);
              const rankChange = getRankChange(player);
              const isCurrentUser = player.id === currentUser?.uid;

              return (
                <tr 
                  key={player.id}
                  className={isCurrentUser ? 'current-user' : ''}
                >
                  <td className="position">
                    {position <= 3 ? (
                      <span className={`medal position-${position}`}>
                        {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : position}
                  </td>
                  <td className="player">
                    <div className="player-cell">
                      <img 
                        src={player.photoURL || '/default-avatar.png'} 
                        alt={player.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{player.username}</span>
                      {isCurrentUser && <span className="you-badge">Você</span>}
                    </div>
                  </td>
                  <td className="level">
                    <div className="level-badge">
                      <Target className="w-4 h-4" />
                      {player.level}
                    </div>
                  </td>
                  <td className="score">{player.score}</td>
                  <td className="wins">{player.wins || 0}</td>
                  <td className="winrate">{player.winRate}%</td>
                  <td className="rank-change">
                    <div className="change-indicator">
                      {rankChange.icon}
                      {rankChange.value > 0 && rankChange.value}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Anterior
        </button>
        <span className="page-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Ranking;