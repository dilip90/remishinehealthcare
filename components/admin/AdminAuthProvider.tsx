'use client';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { auth, db } from '@/lib/firebase';

type AdminProfile = {
  name?: string;
  email?: string;
  role?: 'super-admin' | 'admin' | 'product-manager';
  status?: 'active' | 'inactive';
};

type AdminAuthContextValue = {
  user: User | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function hasAdminAccess(profile: AdminProfile | null) {
  return Boolean(
    profile?.status !== 'inactive' &&
      (profile?.role === 'super-admin' ||
        profile?.role === 'admin' ||
        profile?.role === 'product-manager'),
  );
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async (currentUser: User | null) => {
    setError('');

    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const snapshot = await getDoc(doc(db, 'users', currentUser.uid));

      if (!snapshot.exists()) {
        setProfile(null);
        setError('Admin profile not found. Add this user in Firestore users collection.');
        return;
      }

      const nextProfile = snapshot.data() as AdminProfile;
      setProfile(nextProfile);

      if (!hasAdminAccess(nextProfile)) {
        setError('This account does not have admin access.');
      }
    } catch {
      setProfile(null);
      setError('Unable to verify admin access right now.');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setIsLoading(true);
      setUser(nextUser);
      await loadProfile(nextUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError('');

      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        setUser(credential.user);
        await loadProfile(credential.user);
      } catch {
        setError('Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    },
    [loadProfile],
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isAdmin: hasAdminAccess(profile),
      error,
      login,
      logout,
      refreshProfile,
    }),
    [error, isLoading, login, logout, profile, refreshProfile, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);

  if (!value) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }

  return value;
}
