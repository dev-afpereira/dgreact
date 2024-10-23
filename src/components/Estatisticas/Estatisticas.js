import React, { useState, useEffect } from 'react';
import { obterEstatisticas } from '../../services/HistoricoService';
import './Estatisticas.css';

function Estatisticas({ database, playerId }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const estatisticas = await obterEstatisticas(database, playerId);
        setStats(estatisticas);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEstatisticas();
  }, [database, playerId]);

  if (isLoading) {
    return <div className="stats-loading">Carregando estatísticas...</div>;
  }

  if (!stats) {
    return <div className="stats-error">Erro ao carregar estatísticas</div>;
  }

  const winRate = stats.totalPartidas > 0 
    ? Math.round((stats.vitorias / stats.totalPartidas) * 100) 
    : 0;

  return (
    <div className="estatisticas-container">
      <h2 className="estatisticas-titulo">Suas Estatísticas</h2>
      <div className="stats-grid">
        <div className="stat-card total-partidas">
          <h3>Total de Partidas</h3>
          <div className="stat-value">{stats.totalPartidas}</div>
        </div>
        <div className="stat-card win-rate">
          <h3>Taxa de Vitória</h3>
          <div className="stat-value">{winRate}%</div>
          <div className="stat-details">
            {stats.vitorias} V / {stats.derrotas} D
          </div>
        </div>
        <div className="stat-card pontuacao">
          <h3>Melhor Pontuação</h3>
          <div className="stat-value">{stats.melhorPontuacao}</div>
          <div className="stat-details">
            Média: {stats.mediaPontos}
          </div>
        </div>
        <div className="stat-card sequencia">
          <h3>Melhor Sequência</h3>
          <div className="stat-value">{stats.melhorSequencia}</div>
          <div className="stat-details">
            Total de Acertos: {stats.totalAcertos}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estatisticas;