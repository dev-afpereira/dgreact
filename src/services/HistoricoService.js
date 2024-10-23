import { ref, push, get } from 'firebase/database';

export const registrarPartida = async (database, partida) => {
  try {
    const historicoRef = ref(database, `historico/${partida.playerId}`);
    await push(historicoRef, {
      ...partida,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Erro ao registrar partida:', error);
    throw error;
  }
};

export const obterEstatisticas = async (database, playerId) => {
  try {
    const historicoRef = ref(database, `historico/${playerId}`);
    const snapshot = await get(historicoRef);
    
    if (!snapshot.exists()) {
      return {
        totalPartidas: 0,
        vitorias: 0,
        derrotas: 0,
        pontosTotal: 0,
        melhorPontuacao: 0,
        mediaPontos: 0,
        totalAcertos: 0,
        melhorSequencia: 0
      };
    }

    const partidas = Object.values(snapshot.val());
    
    return partidas.reduce((stats, partida) => ({
      totalPartidas: stats.totalPartidas + 1,
      vitorias: stats.vitorias + (partida.venceu ? 1 : 0),
      derrotas: stats.derrotas + (partida.venceu ? 0 : 1),
      pontosTotal: stats.pontosTotal + partida.pontuacao,
      melhorPontuacao: Math.max(stats.melhorPontuacao, partida.pontuacao),
      mediaPontos: Math.round((stats.pontosTotal + partida.pontuacao) / (stats.totalPartidas + 1)),
      totalAcertos: stats.totalAcertos + partida.acertos,
      melhorSequencia: Math.max(stats.melhorSequencia, partida.melhorSequencia)
    }), {
      totalPartidas: 0,
      vitorias: 0,
      derrotas: 0,
      pontosTotal: 0,
      melhorPontuacao: 0,
      mediaPontos: 0,
      totalAcertos: 0,
      melhorSequencia: 0
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};