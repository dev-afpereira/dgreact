import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  setUserProfile: () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Buscar perfil do usuário no Realtime Database
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          }
        } catch (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    setUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}