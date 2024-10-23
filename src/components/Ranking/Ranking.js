import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import './Ranking.css';

function Ranking({ database, currentPlayerId }) {
  const [rankings, setRankings] = useState({
    pontuacaoTotal: [],
    sequenciaMaxima: [],
    vitorias: [],
    mediaAcertos: []
  });
  const [categoria, setCategoria] = useState('pontuacaoTotal');
  const [periodo, setPeriodo] = useState('geral');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarRanking = () => {
      const rankingRef = ref(database, 'players');
      
      return onValue(rankingRef, (snapshot) => {
        if (snapshot.exists()) {
          const players = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
            estatisticas: data.estatisticas || {
              pontuacaoTotal: 0,
              sequenciaMaxima: 0,
              vitorias: 0,
              partidasJogadas: 0,
              acertosTotal: 0
            }
          }));

          // Filtra jogadores baseado no período selecionado
          const jogadoresFiltrados = filtrarPorPeriodo(players, periodo);

          // Calcula diferentes rankings
          const novoRanking = {
            pontuacaoTotal: ordenarJogadores(jogadoresFiltrados, 'pontuacaoTotal'),
            sequenciaMaxima: ordenarJogadores(jogadoresFiltrados, 'sequenciaMaxima'),
            vitorias: ordenarJogadores(jogadoresFiltrados, 'vitorias'),
            mediaAcertos: ordenarJogadores(jogadoresFiltrados, 'mediaAcertos', true)
          };

          setRankings(novoRanking);
          setIsLoading(false);
        }
      });
    };

    const unsubscribe = carregarRanking();
    return () => unsubscribe();
  }, [database, periodo]);

  const filtrarPorPeriodo = (players, periodo) => {
    const agora = new Date();
    switch (periodo) {
      case 'dia':
        const inicioDia = new Date(agora.setHours(0, 0, 0, 0));
        return players.filter(p => new Date(p.ultimoJogo) >= inicioDia);
      
      case 'semana':
        const inicioSemana = new Date(agora.setDate(agora.getDate() - agora.getDay()));
        return players.filter(p => new Date(p.ultimoJogo) >= inicioSemana);
      
      case 'mes':
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        return players.filter(p => new Date(p.ultimoJogo) >= inicioMes);
      
      default:
        return players;
    }
  };

  const ordenarJogadores = (players, categoria, usarMedia = false) => {
    return [...players]
      .sort((a, b) => {
        if (usarMedia) {
          const mediaA = a.estatisticas.acertosTotal / (a.estatisticas.partidasJogadas || 1);
          const mediaB = b.estatisticas.acertosTotal / (b.estatisticas.partidasJogadas || 1);
          return mediaB - mediaA;
        }
        return (b.estatisticas[categoria] || 0) - (a.estatisticas[categoria] || 0);
      })
      .slice(0, 10);
  };

  const renderPosicao = (posicao) => {
    switch (posicao) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return posicao;
    }
  };

  const getCategoriaLabel = () => {
    switch (categoria) {
      case 'pontuacaoTotal': return 'Pontos';
      case 'sequenciaMaxima': return 'Seq. Máx';
      case 'vitorias': return 'Vitórias';
      case 'mediaAcertos': return 'Média';
      default: return '';
    }
  };

  const getValorCategoria = (player) => {
    if (categoria === 'mediaAcertos') {
      const media = player.estatisticas.acertosTotal / (player.estatisticas.partidasJogadas || 1);
      return media.toFixed(1);
    }
    return player.estatisticas[categoria] || 0;
  };

  if (isLoading) {
    return <div className="ranking-loading">Carregando ranking...</div>;
  }

  const rankingAtual = rankings[categoria] || [];
  const playerRank = rankingAtual.findIndex(p => p.id === currentPlayerId) + 1;

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h2>Ranking</h2>
        <div className="ranking-filters">
          <select 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
            className="ranking-select"
          >
            <option value="pontuacaoTotal">Pontuação Total</option>
            <option value="sequenciaMaxima">Maior Sequência</option>
            <option value="vitorias">Vitórias</option>
            <option value="mediaAcertos">Média de Acertos</option>
          </select>

          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            className="ranking-select"
          >
            <option value="geral">Geral</option>
            <option value="mes">Este Mês</option>
            <option value="semana">Esta Semana</option>
            <option value="dia">Hoje</option>
          </select>
        </div>
      </div>

      <div className="ranking-list">
        {rankingAtual.map((player, index) => (
          <div 
            key={player.id}
            className={`ranking-item ${player.id === currentPlayerId ? 'current-player' : ''}`}
          >
            <div className="ranking-position">{renderPosicao(index + 1)}</div>
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="player-level">Nível {player.level || 1}</span>
            </div>
            <div className="ranking-score">
              <span className="score-value">{getValorCategoria(player)}</span>
              <span className="score-label">{getCategoriaLabel()}</span>
            </div>
          </div>
        ))}
      </div>

      {!rankingAtual.some(p => p.id === currentPlayerId) && playerRank > 0 && (
        <div className="current-player-position">
          <div className="separator">• • •</div>
          <div className="ranking-item current-player">
            <div className="ranking-position">{playerRank}</div>
            <div className="player-info">
              <span className="player-name">Você</span>
              <span className="player-level">
                Nível {rankings[categoria].find(p => p.id === currentPlayerId)?.level || 1}
              </span>
            </div>
            <div className="ranking-score">
              <span className="score-value">
                {getValorCategoria(rankings[categoria].find(p => p.id === currentPlayerId) || {})}
              </span>
              <span className="score-label">{getCategoriaLabel()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ranking;