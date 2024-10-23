import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile 
  } from 'firebase/auth';
  import { ref, set, get } from 'firebase/database';
  import { useEffect, useState } from 'react';

  export const auth = getAuth();
  
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(translateFirebaseError(error.code));
    }
  };
  
  export const registerUser = async (email, password, username, database) => {
    try {
      // Verificar se o username já existe
      const usernameRef = ref(database, `usernames/${username.toLowerCase()}`);
      const usernameSnapshot = await get(usernameRef);
      
      if (usernameSnapshot.exists()) {
        throw new Error('Nome de usuário já está em uso');
      }
  
      // Criar usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Atualizar o perfil com o username
      await updateProfile(user, {
        displayName: username
      });
  
      // Criar registro do usuário no Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        username,
        email,
        createdAt: Date.now(),
        role: 'user',
        status: 'active',
        stats: {
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0
        }
      });
  
      // Registrar username para garantir unicidade
      await set(ref(database, `usernames/${username.toLowerCase()}`), user.uid);
  
      return user;
    } catch (error) {
      throw new Error(translateFirebaseError(error.code));
    }
  };
  
  export const logoutUser = async () => {
    try {
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
      'default': 'Ocorreu um erro. Tente novamente'
    };
  
    return errorMessages[errorCode] || errorMessages.default;
  };
  
  // Hook personalizado para autenticação
  export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        setLoading(false);
      });
  
      return unsubscribe;
    }, []);
  
    return { currentUser, loading };
  };