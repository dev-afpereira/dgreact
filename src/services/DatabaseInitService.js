import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

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