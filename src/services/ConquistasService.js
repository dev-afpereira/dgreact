// Lista de todas as conquistas possíveis
export const CONQUISTAS = {
    PRIMEIRO_ACERTO: {
      id: 'primeiro_acerto',
      nome: 'Primeiro Acerto!',
      descricao: 'Acertou o número pela primeira vez',
      icone: '🎯'
    },
    TRES_SEGUIDOS: {
      id: 'tres_seguidos',
      nome: 'Hat-trick',
      descricao: 'Acertou três vezes seguidas',
      icone: '🎩'
    },
    PONTOS_100: {
      id: 'pontos_100',
      nome: 'Centenário',
      descricao: 'Atingiu 100 pontos em um jogo',
      icone: '💯'
    },
    NIVEL_3: {
      id: 'nivel_3',
      nome: 'Mestre do Jogo',
      descricao: 'Alcançou o nível 3',
      icone: '🏆'
    },
    MULTIPLIER_3X: {
      id: 'multiplier_3x',
      nome: 'Combo Master',
      descricao: 'Conseguiu um multiplicador 3x',
      icone: '⚡'
    },
    VENCEDOR_PARTIDA: {
      id: 'vencedor_partida',
      nome: 'Vitorioso',
      descricao: 'Venceu uma partida',
      icone: '👑'
    }
  };
  
  // Função para verificar conquistas
  export const verificarConquistas = (playerData, conquistas_atuais) => {
    const novasConquistas = [];
    
    // Verifica cada conquista possível
    if (!conquistas_atuais.includes('primeiro_acerto') && playerData.score > 0) {
      novasConquistas.push(CONQUISTAS.PRIMEIRO_ACERTO);
    }
    
    if (!conquistas_atuais.includes('tres_seguidos') && playerData.consecutiveHits >= 3) {
      novasConquistas.push(CONQUISTAS.TRES_SEGUIDOS);
    }
    
    if (!conquistas_atuais.includes('pontos_100') && playerData.score >= 100) {
      novasConquistas.push(CONQUISTAS.PONTOS_100);
    }
    
    if (!conquistas_atuais.includes('nivel_3') && playerData.level >= 3) {
      novasConquistas.push(CONQUISTAS.NIVEL_3);
    }
    
    if (!conquistas_atuais.includes('multiplier_3x') && playerData.consecutiveHits >= 4) {
      novasConquistas.push(CONQUISTAS.MULTIPLIER_3X);
    }
    
    return novasConquistas;
  };