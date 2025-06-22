import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ID, Query, Models, AppwriteException } from 'appwrite';
import { databases, account } from '../lib/appwrite';

// Environment variables with proper type safety
const ENV = {
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID || '',
  COLLECTION_ID: import.meta.env.VITE_APPWRITE_ACCOUNTS_COLLECTION_ID || '',
  API_KEY: import.meta.env.VITE_APPWRITE_API_KEY || '',
  ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT || '',
  PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID || ''
} as const;

export type Labels = 'ADMIN' | 'MANAGER' | 'CUSTOMER';

// Types
export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';

export type UserLanguage = 'VI' | 'EN' | 'CN';

export type UserNotification = 'EMAIL' | 'SMS' | 'PUSH';

export interface UserPreferences {
  theme?: ThemePreference;
  notifications?: UserNotification[];
  language?: UserLanguage;
}

interface AppwriteDocument {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export interface UserAccount extends Omit<Models.User<Models.Preferences>, 'phone' | 'status'>, AppwriteDocument {
  // Core fields
  name: string;
  phone: string;
  status: boolean;
  labels: Labels[];
  address: string;
  preferences: UserPreferences;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  avatarUrl?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface UpdateUserData extends Partial<Omit<UserAccount, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>> {
  password?: never; // Prevent direct password updates
}

export type { UpdateUserData };

interface AccountContextType {
  // State
  currentUser: UserAccount | null;
  users: UserAccount[];
  loading: boolean;
  error: string | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ session: Models.Session; user: UserAccount }>;
  register: (userData: RegisterData) => Promise<{ accountData: Models.User<Models.Preferences>; user: UserAccount }>;
  logout: () => Promise<void>;
  
  // User management
  getCurrentUser: () => Promise<UserAccount | null>;
  getUserById: (id: string) => Promise<UserAccount | null>;
  updateUser: (id: string, updates: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  listUsers: (queries?: string[]) => Promise<UserAccount[]>;
  searchUsers: (query: string) => Promise<UserAccount[]>;
  
  // Password management
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (userId: string, secret: string, password: string, confirmPassword: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string, userId?: string) => Promise<void>;
  updateEmail: (email: string, password: string) => Promise<UserAccount>;
  
  // Email verification
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<UserAccount>;
  
  // Admin functions
  updateUserRole: (userId: string, role: Labels) => Promise<void>;
  updateUserStatus: (userId: string, status: boolean) => Promise<void>;
  refreshSession: () => Promise<{ session: Models.Session; user: UserAccount } | null>;
  updateProfile: (updates: Partial<UserAccount>) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'SYSTEM',
  notifications: [],
  language: 'EN'
};

// Moved outside the component to prevent recreation
const parseUserData = (data: any): UserAccount => {
  const now = new Date().toISOString();
  const baseUser: Partial<UserAccount> = {
    $id: data.$id || '',
    $createdAt: data.$createdAt || now,
    $updatedAt: data.$updatedAt || now,
    $permissions: Array.isArray(data.$permissions) ? data.$permissions : [],
    email: data.email || '',
    name: data.name || '',
    phone: data.phone || '',
    status: data.status || false,
    emailVerification: data.emailVerification || false,
    labels: Array.isArray(data.labels) ? data.labels : [],
    address: data.address,
    preferences: data.preferences 
      ? typeof data.preferences === 'string' 
        ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data.preferences) }
        : { ...DEFAULT_PREFERENCES, ...data.preferences }
      : { ...DEFAULT_PREFERENCES },
    isEmailVerified: data.isEmailVerified || false,
    lastLoginAt: data.lastLoginAt,
    avatarUrl: data.avatarUrl
  };
  return baseUser as UserAccount;
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const listUsersRef = useRef<((queries?: string[]) => Promise<UserAccount[]>) | null>(null);

  // List all users (admin function)
  const listUsers = useCallback(async (queries: string[] = []): Promise<UserAccount[]> => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        ENV.DATABASE_ID,
        ENV.COLLECTION_ID,
        queries
      );
      const usersList = response.documents.map(doc => parseUserData(doc));
      setUsers(usersList);
      return usersList;
    } catch (err) {
      console.error("Error listing users:", err);
      setError("Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Store listUsers in ref for external access
  useEffect(() => {
    listUsersRef.current = listUsers;
  }, [listUsers]);
  
  // Get current authenticated user
  const getCurrentUser = useCallback(async (): Promise<UserAccount> => {
    try {
      setLoading(true);
      // Get auth user
      const authUser = await account.get();
      if (!authUser) throw new Error('No authenticated user');
      // Get extended user data
      const userDoc = await databases.getDocument(
        ENV.DATABASE_ID,
        ENV.COLLECTION_ID,
        authUser.$id
      );
      // Update last login timestamp
      await databases.updateDocument(
        ENV.DATABASE_ID,
        ENV.COLLECTION_ID,
        authUser.$id,
        { lastLoginAt: new Date().toISOString() }
      );
      const userData = parseUserData({ 
        ...authUser, 
        ...userDoc,
        lastLoginAt: new Date().toISOString() 
      });
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      const appwriteError = error as AppwriteException;
      console.error('Failed to fetch current user:', appwriteError.message);
      // Clear invalid session
      if (appwriteError.code === 401) {
        await account.deleteSession('current');
        setCurrentUser(null);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (email: string, password: string): Promise<{ session: Models.Session; user: UserAccount }> => {
    try {
      setLoading(true);
      setError(null);
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      // Create session
      const session = await account.createEmailPasswordSession(email, password);
      // Update current user
      const user = await getCurrentUser();
      return { session, user };
    } catch (error) {
      const appwriteError = error as AppwriteException;
      const errorMessage = appwriteError.type === 'user_invalid_credentials' 
        ? 'Invalid email or password'
        : 'Failed to login. Please try again.';
      setError(errorMessage);
      console.error('Login error:', appwriteError);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser]);

  // Register new user
  const register = useCallback(async (userData: RegisterData): Promise<{ accountData: Models.User<any>; user: UserAccount }> => {
    try {
      setLoading(true);
      setError(null);
      // Validate input
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('All required fields must be provided');
      }
      const { email, password, name, phone } = userData;
      
      // Create Appwrite account
      const accountData = await account.create(ID.unique(), email, password, name);
      
      // Create user document in database
      const userDoc = await databases.createDocument(
        ENV.DATABASE_ID,
        ENV.COLLECTION_ID,
        accountData.$id,
        {
          name,
          email,
          phone: phone || '',
          status: true,
          labels: ['CUSTOMER'],
          address: '',
          preferences: DEFAULT_PREFERENCES,
          isEmailVerified: false,
          isPhoneVerified: false,
          lastLoginAt: new Date().toISOString()
        }
      );
      
      const user = parseUserData({ ...accountData, ...userDoc });
      setCurrentUser(user);
      return { accountData, user };
    } catch (error) {
      const appwriteError = error as AppwriteException;
      let errorMessage = 'Failed to register user';
      if (appwriteError.type === 'user_already_exists') {
        errorMessage = 'An account with this email already exists';
      } else if (appwriteError.type === 'user_invalid_email') {
        errorMessage = 'Please enter a valid email address';
      } else if (appwriteError.type === 'user_password_policy_violation') {
        errorMessage = 'Password does not meet requirements';
      }
      setError(errorMessage);
      console.error('Registration error:', appwriteError);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await account.deleteSession('current');
      setCurrentUser(null);
      setUsers([]);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the local state
      setCurrentUser(null);
      setUsers([]);
      throw new Error('Failed to logout');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user by ID (admin function)
  const getUserById = useCallback(async (id: string): Promise<UserAccount | null> => {
    try {
      setLoading(true);
      const userDoc = await databases.getDocument(
        ENV.DATABASE_ID,
        ENV.COLLECTION_ID,
        id
      );
      return parseUserData(userDoc);
    } catch (err) {
      console.error("Error getting user by ID:", err);
      setError("Failed to fetch user");
      return null;
    }
  }, []);

  // Define updateUser, deleteUser, searchUsers before context value
  const updateUser = async (userId: string, updates: Partial<UserAccount>) => {
    try {
      setLoading(true);
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      await databases.updateDocument(
        ENV.DATABASE_ID,
        ENV.COLLECTION_ID,
        userId,
        {
          ...cleanUpdates,
          $updatedAt: new Date().toISOString()
        } as Record<string, any>
      );
      if (currentUser?.$id === userId) {
        const updatedUser = await getCurrentUser();
        setCurrentUser(updatedUser);
      }
      await listUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      await databases.deleteDocument(ENV.DATABASE_ID, ENV.COLLECTION_ID, id);
      setCurrentUser(null);
      await listUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const searchUsers = async (query: string) => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(ENV.DATABASE_ID, ENV.COLLECTION_ID, [query]);
      const usersList = response.documents.map(doc => parseUserData(doc));
      setUsers(usersList);
      return usersList;
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo((): AccountContextType => ({
    // State
    currentUser,
    users,
    loading,
    error,
    
    // Auth methods
    login: async (email: string, password: string): Promise<{ session: Models.Session; user: UserAccount }> => {
      try {
        setLoading(true);
        const session = await account.createEmailPasswordSession(email, password);
        const user = await getCurrentUser();
        return { session, user };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    register: async (userData: RegisterData) => {
      try {
        setLoading(true);
        const { email, password, name, phone } = userData;
        const accountData = await account.create(ID.unique(), email, password, name);
        
        // Create user document in database
        const userDoc = await databases.createDocument(
          ENV.DATABASE_ID,
          ENV.COLLECTION_ID,
          accountData.$id,
          {
            name,
            email,
            phone: phone || '',
            status: true,
            labels: ['CUSTOMER'],
            address: '',
            preferences: DEFAULT_PREFERENCES,
            isEmailVerified: false,
            isPhoneVerified: false,
            lastLoginAt: new Date().toISOString()
          }
        );
        
        const user = parseUserData({ ...accountData, ...userDoc });
        setCurrentUser(user);
        return { accountData, user };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      try {
        setLoading(true);
        await account.deleteSession('current');
        setCurrentUser(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Logout failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    getCurrentUser: async () => {
      try {
        setLoading(true);
        const user = await account.get();
        const userDoc = await databases.getDocument(
          ENV.DATABASE_ID,
          ENV.COLLECTION_ID,
          user.$id
        );
        const parsedUser = parseUserData({ ...user, ...userDoc });
        setCurrentUser(parsedUser);
        return parsedUser;
      } catch (err) {
        setCurrentUser(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    getUserById,
    updateUser: updateUser,
    deleteUser: deleteUser,
    listUsers,
    searchUsers: searchUsers,
    updatePassword: async (currentPassword: string, newPassword: string, userId?: string) => {
      try {
        setLoading(true);
        if (userId) {
          // Admin updating another user's password
          await account.updatePassword(userId, newPassword);
        } else {
          // User updating their own password
          await account.updatePassword(newPassword, currentPassword);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password update failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    updateEmail: async (email: string, password: string) => {
      try {
        setLoading(true);
        await account.updateEmail(email, password);
        const user = await getCurrentUser();
        return user;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Email update failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    verifyEmail: async (userId: string, secret: string) => {
      try {
        setLoading(true);
        await account.updateVerification(userId, secret);
        const user = await getCurrentUser();
        return user;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Email verification failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    requestPasswordReset: async (email: string) => {
      try {
        setLoading(true);
        await account.createRecovery(email, `${window.location.origin}/reset-password`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password reset request failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    confirmPasswordReset: async (userId: string, secret: string, password: string, confirmPassword: string) => {
      try {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        setLoading(true);
        await account.updateRecovery(userId, secret, password); // Only 3 args
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password reset failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    updateProfile: async (updates: Partial<UserAccount>) => {
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      return updateUser(currentUser.$id, updates);
    },
    refreshSession: async () => {
      try {
        const session = await account.getSession('current');
        if (session) {
          const user = await getCurrentUser();
          return { session, user };
        }
        return null;
      } catch (err) {
        setCurrentUser(null);
        throw err;
      }
    },
    sendVerificationEmail: async () => {
      if (!currentUser) throw new Error('No user logged in');
      await account.createVerification(`${window.location.origin}/verify-email`);
    },
    updateUserRole: async (userId: string, role: Labels) => {
      // Add or remove role in labels
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      let labels = user.labels;
      if (!labels.includes(role)) {
        labels = [...labels, role];
      }
      await updateUser(userId, { labels } as Partial<UserAccount>);
    },
    updateUserStatus: async (userId: string, status: boolean) => {
      await updateUser(userId, { status } as Partial<UserAccount>);
    }
  }), [currentUser, users, loading, error, getCurrentUser, getUserById, updateUser, deleteUser, listUsers, searchUsers]);

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
}
