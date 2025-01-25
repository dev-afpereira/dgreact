import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  setUserProfile: () => {},
  error: null,
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          }
          setCurrentUser(user);
        } catch (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
          setError('Erro ao buscar perfil do usuário.');
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  if (initializing) {
    return null;
  }

  const value = {
    currentUser,
    userProfile,
    error,
    setUserProfile,
    loginUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}