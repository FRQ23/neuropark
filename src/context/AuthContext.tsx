import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CommitteeSpecialty } from '../types';
import { SEED_USERS } from '../services/mockData';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loginAsUser: (userId: string) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  isCommittee: boolean;
  isViewer: boolean;
  canValidateSpecialty: (specialty?: CommitteeSpecialty | 'general') => boolean;
  canManageSettings: boolean; // only admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) return saved;
    // Default to first admin for quick exploration
    return SEED_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      setStoredItem(STORAGE_KEYS.CURRENT_USER, currentUser);
    }
  }, [currentUser]);

  const loginAsUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const loginWithEmail = (email: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isCommittee = currentUser?.role === 'committee';
  const isViewer = currentUser?.role === 'viewer';

  // Committee reviews and validates requirements of their own specialty (education, psychology, finance)
  // Admin can validate anything as master administrator
  const canValidateSpecialty = (specialty?: CommitteeSpecialty | 'general'): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    if (isViewer) return false;
    if (isCommittee) {
      if (!specialty || specialty === 'general') return true;
      return currentUser.specialty === specialty;
    }
    return false;
  };

  // Only admin creates/edits areas, infrastructure, equipment, phases, requirements, templates, parks, users
  const canManageSettings = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        loginAsUser,
        loginWithEmail,
        logout,
        isAdmin,
        isCommittee,
        isViewer,
        canValidateSpecialty,
        canManageSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
