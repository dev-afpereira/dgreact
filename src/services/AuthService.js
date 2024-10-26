import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

export const auth = getAuth();

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verifica se o usuário existe no Realtime Database
    const userRef = ref(database, `users/${userCredential.user.uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await signOut(auth);
      throw new Error('Usuário não registrado. Por favor, crie uma conta.');
    }
    
    return userCredential.user;
  } catch (error) {
    if (error.code) {
      throw new Error(translateFirebaseError(error.code));
    }
    throw error;
  }
};

export const registerUser = async (email, password, username) => {
  try {
    // Primeiro cria o usuário com Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Depois cria o perfil do usuário no Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    const usernameRef = ref(database, `usernames/${username.toLowerCase()}`);

    await Promise.all([
      // Salva os dados do usuário
      set(userRef, {
        username,
        email,
        createdAt: Date.now(),
        role: 'user',
        status: 'active',
        level: 1,
        photoURL: null,
        stats: {
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          winRate: 0
        }
      }),
      // Salva o username para garantir unicidade
      set(usernameRef, user.uid)
    ]);

    // Atualiza o perfil do usuário no Authentication
    await updateProfile(user, {
      displayName: username
    });

    return user;
  } catch (error) {
    // Se houver erro, limpa tudo para evitar dados inconsistentes
    if (error.code === 'PERMISSION_DENIED') {
      console.error('Erro de permissão:', error);
      // Tenta fazer logout do usuário recém criado
      try {
        await auth.signOut();
      } catch (logoutError) {
        console.error('Erro ao fazer logout após falha no registro:', logoutError);
      }
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Atualizar lastSeen antes de fazer logout
    const user = auth.currentUser;
    if (user) {
      await set(ref(database, `users/${user.uid}/lastSeen`), Date.now());
    }
    await signOut(auth);
  } catch (error) {
    throw new Error(translateFirebaseError(error.code));
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(translateFirebaseError(error.code));
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, updates);
  } catch (error) {
    throw new Error('Erro ao atualizar perfil do usuário');
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    throw new Error('Usuário não encontrado');
  } catch (error) {
    throw new Error('Erro ao buscar perfil do usuário');
  }
};

const translateFirebaseError = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Este email já está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca',
    'auth/user-disabled': 'Usuário desativado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/requires-recent-login': 'Por favor, faça login novamente para continuar',
    'auth/popup-closed-by-user': 'Operação cancelada pelo usuário',
    'auth/unauthorized-domain': 'Domínio não autorizado',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    'default': 'Ocorreu um erro. Tente novamente'
  };

  return errorMessages[errorCode] || errorMessages.default;
};