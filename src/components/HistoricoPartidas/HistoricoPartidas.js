import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import './HistoricoPartidas.css';

function HistoricoPartidas({ database, playerId }) {
  const [partidas, setPartidas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const historicoRef = ref(database, `historico/${playerId}`);
    const unsubscribe = onValue(historicoRef, (snapshot) => {
      if (snapshot.exists()) {
        const historicoData = snapshot.val();
        // Converte o objeto em array e ordena por data
        const historicoArray = Object.entries(historicoData)
          .map(([key, value]) => ({
            id: key,
            ...value
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setPartidas(historicoArray);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [database, playerId]);

  const formatarData = (timestamp) => {
    const data = new Date(timestamp);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="historico-loading">
        Carregando histórico...
      </div>
    );
  }

  return (
    <div className="historico-container">
      <h2 className="historico-titulo">Histórico de Partidas</h2>
      {partidas.length === 0 ? (
        <p className="historico-vazio">Nenhuma partida registrada ainda.</p>
      ) : (
        <div className="partidas-lista">
          {partidas.map(partida => (
            <div key={partida.id} className="partida-card">
              <div className="partida-header">
                <span className="partida-data">{formatarData(partida.timestamp)}</span>
                <span className={`partida-resultado ${partida.venceu ? 'vitoria' : 'derrota'}`}>
                  {partida.venceu ? 'Vitória' : 'Derrota'}
                </span>
              </div>
              <div className="partida-detalhes">
                <div className="partida-info">
                  <span>Pontuação: {partida.pontuacao}</span>
                  <span>Nível Alcançado: {partida.nivel}</span>
                </div>
                <div className="partida-stats">
                  <div className="stat-item">
                    <span className="stat-label">Acertos</span>
                    <span className="stat-value">{partida.acertos}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Melhor Sequência</span>
                    <span className="stat-value">{partida.melhorSequencia}</span>
                  </div>
                </div>
                <div className="partida-players">
                  <span>Jogadores: {partida.jogadores.join(', ')}</span>
                </div>
              </div>
              {partida.conquistasDesbloqueadas && partida.conquistasDesbloqueadas.length > 0 && (
                <div className="conquistas-desbloqueadas">
                  <span className="conquistas-titulo">Conquistas Desbloqueadas:</span>
                  <div className="conquistas-lista">
                    {partida.conquistasDesbloqueadas.map((conquista, index) => (
                      <span key={index} className="conquista-item">
                        {conquista.icone} {conquista.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoricoPartidas;