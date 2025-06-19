import { ID, Models } from 'appwrite';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { account } from '../lib/appwrite';

type User = Models.User<Models.Preferences> | null;

interface AuthContextType {
  current: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const value: AuthContextType = {
    current: user,
    login,
    logout,
    register,
    isLoading,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
