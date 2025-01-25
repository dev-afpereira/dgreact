import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const defaultGames = {
  'jogo-da-velha': {
    id: 'jogo-da-velha',
    name: 'Jogo da Velha',
    description: 'Clássico jogo de X e O',
    rules: 'Alinhe três símbolos iguais na horizontal, vertical ou diagonal',
    minPlayers: 2,
    maxPlayers: 2
  },
  'forca': {
    id: 'forca',
    name: 'Jogo da Forca',
    description: 'Adivinhe a palavra antes que o boneco seja enforcado',
    rules: 'Tente adivinhar a palavra escolhendo letras. 6 erros e você perde',
    minPlayers: 1,
    maxPlayers: 2
  },
  'jogo-do-numero': {
    id: 'jogo-do-numero',
    name: 'Jogo do Número',
    description: 'Adivinhe o número sorteado',
    rules: 'Escolha um número entre 1 e 10. Acerte o número sorteado para ganhar pontos',
    minPlayers: 2,
    maxPlayers: 6
  },
  // Adicione outros jogos aqui se necessário
};

export const initializeDatabase = async () => {
  try {
    // Primeiro, verifica se o banco já está inicializado
    const rootRef = ref(database, '/');
    const snapshot = await get(rootRef);

    if (!snapshot.exists()) {
      // Se não existir dados, inicializa com a estrutura básica
      await set(rootRef, {
        users: {},
        games: {},
        usernames: {},
        rankings: {
          global: {
            lastUpdated: Date.now(),
            players: {}
          },
          weekly: {
            lastUpdated: Date.now(),
            players: {}
          },
          monthly: {
            lastUpdated: Date.now(),
            players: {}
          }
        },
        gameStats: {
          totalGames: 0,
          activePlayers: 0,
          totalPlayers: 0,
          lastUpdated: Date.now()
        }
      });
      console.log('Database initialized successfully');
    }

    const gamesRef = ref(database, 'games');
    const gamesSnapshot = await get(gamesRef);

    if (!gamesSnapshot.exists()) {
      console.log('Inicializando jogos padrão...');
      await set(gamesRef, defaultGames);
      console.log('Jogos inicializados com sucesso!');
    }
  } catch (error) {
    console.error('Error checking/initializing database:', error);
    // Se houver erro, tenta novamente com estrutura mínima
    try {
      await set(ref(database, '/'), {
        users: {},
        games: {}
      });
      console.log('Database initialized with minimal structure');
    } catch (retryError) {
      console.error('Failed to initialize database:', retryError);
    }
  }
};