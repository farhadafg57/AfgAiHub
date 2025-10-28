'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase';

type UserState = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export const useUser = (): UserState => {
  const auth = useAuth();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUserState({ user, isLoading: false, error: null });
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setUserState({ user: null, isLoading: false, error });
      }
    );
    return () => unsubscribe();
  }, [auth]);

  return userState;
};
