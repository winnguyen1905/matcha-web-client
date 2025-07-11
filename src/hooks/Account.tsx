import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ID, Query, Models, AppwriteException } from 'appwrite';
import { databases, account } from '../lib/appwrite';
import { 
  UserInformation, 
  Address, 
  CreateUserInformation, 
  UpdateUserInformation,
  COLLECTIONS,
  addressToShippingAddress,
  getDefaultAddress,
  getAddressesByType
} from '../lib/schema';

// Environment variables
const ENV = {
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID || '',
  ACCOUNTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_ACCOUNTS_COLLECTION_ID || 'accounts',
} as const;

// Simplified Auth User (from Appwrite)
export interface AuthUser extends Models.User<Models.Preferences> {
  // Only authentication-related fields
}

// Combined User (Auth + Profile)
export interface User {
  auth: AuthUser;
  profile: UserInformation | null;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface AccountContextType {
  // State
  currentUser: User | null;
  authUser: AuthUser | null;
  userProfile: UserInformation | null;
  loading: boolean;
  error: string | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ session: Models.Session; user: User }>;
  register: (userData: RegisterData) => Promise<{ accountData: AuthUser; user: User }>;
  logout: () => Promise<void>;
  
  // Profile management
  getUserProfile: (userId?: string) => Promise<UserInformation | null>;
  updateProfile: (updates: Partial<UserInformation>) => Promise<UserInformation>;
  createProfile: (data: CreateUserInformation) => Promise<UserInformation>;
  
  // Address management
  addAddress: (address: Omit<Address, 'isDefault'>) => Promise<UserInformation>;
  updateAddress: (addressIndex: number, address: Address) => Promise<UserInformation>;
  removeAddress: (addressIndex: number) => Promise<UserInformation>;
  setDefaultAddress: (addressIndex: number) => Promise<UserInformation>;
  getShippingAddresses: () => Address[];
  getBillingAddresses: () => Address[];
  getDefaultShippingAddress: () => Address | null;
  
  // Utility methods
  refreshSession: () => Promise<{ session: Models.Session; user: User } | null>;
  getCurrentUser: () => Promise<User | null>;
  
  // Password management
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (userId: string, secret: string, password: string, confirmPassword: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (email: string, password: string) => Promise<AuthUser>;
  
  // Email verification
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<AuthUser>;
  
  // Admin
  users: UserAccount[];
  listUsers: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  updateUser: (userId: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: Labels) => Promise<void>;
  updateUserStatus: (userId: string, status: boolean) => Promise<void>;
  verifyUserEmail: (userId: string) => Promise<void>;
  sendUserVerificationEmail: (userId: string) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

// Alias for backward compatibility
export const useUser = useAccount;

const DEFAULT_PREFERENCES = {
  theme: 'system' as const,
  language: 'en' as const,
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Get user profile by ID
  const getUserProfile = useCallback(async (userId?: string): Promise<UserInformation | null> => {
    try {
      const targetUserId = userId || authUser?.$id;
      if (!targetUserId) throw new Error('No user ID provided');

      const response = await databases.listDocuments(
        ENV.DATABASE_ID,
        COLLECTIONS.USER_INFORMATION,
        [Query.equal('userId', targetUserId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const profile = response.documents[0] as UserInformation;
      if (!userId || userId === authUser?.$id) {
        setUserProfile(profile);
      }
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
      return null;
    }
  }, [authUser?.$id]);

  // Create user profile
  const createProfile = useCallback(async (data: CreateUserInformation): Promise<UserInformation> => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      
      const profileData = {
        ...data,
        preferences: { ...DEFAULT_PREFERENCES, ...data.preferences },
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      const response = await databases.createDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.USER_INFORMATION,
        ID.unique(),
        profileData
      );

      const profile = response as UserInformation;
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      setError('Failed to create user profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserInformation>): Promise<UserInformation> => {
    try {
      if (!userProfile) throw new Error('No user profile found');
      
      setLoading(true);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const response = await databases.updateDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.USER_INFORMATION,
        userProfile.$id,
        updatedData
      );

      const updatedProfile = response as UserInformation;
      setUserProfile(updatedProfile);
      
      // Update current user
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          profile: updatedProfile,
        });
      }
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update user profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userProfile, currentUser]);

  // Address management methods
  const addAddress = useCallback(async (address: Omit<Address, 'isDefault'>): Promise<UserInformation> => {
    if (!userProfile) throw new Error('No user profile found');
    
    const newAddress: Address = {
      ...address,
      isDefault: userProfile.addresses.length === 0, // First address is default
    };
    
    const updatedAddresses = [...userProfile.addresses, newAddress];
    return updateProfile({ addresses: updatedAddresses });
  }, [userProfile, updateProfile]);

  const updateAddress = useCallback(async (addressIndex: number, address: Address): Promise<UserInformation> => {
    if (!userProfile) throw new Error('No user profile found');
    if (addressIndex < 0 || addressIndex >= userProfile.addresses.length) {
      throw new Error('Invalid address index');
    }
    
    const updatedAddresses = [...userProfile.addresses];
    updatedAddresses[addressIndex] = address;
    return updateProfile({ addresses: updatedAddresses });
  }, [userProfile, updateProfile]);

  const removeAddress = useCallback(async (addressIndex: number): Promise<UserInformation> => {
    if (!userProfile) throw new Error('No user profile found');
    if (addressIndex < 0 || addressIndex >= userProfile.addresses.length) {
      throw new Error('Invalid address index');
    }
    
    const updatedAddresses = userProfile.addresses.filter((_, index) => index !== addressIndex);
    
    // If we removed the default address, make the first remaining address default
    if (userProfile.addresses[addressIndex].isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    return updateProfile({ addresses: updatedAddresses });
  }, [userProfile, updateProfile]);

  const setDefaultAddress = useCallback(async (addressIndex: number): Promise<UserInformation> => {
    if (!userProfile) throw new Error('No user profile found');
    if (addressIndex < 0 || addressIndex >= userProfile.addresses.length) {
      throw new Error('Invalid address index');
    }
    
    const updatedAddresses = userProfile.addresses.map((addr, index) => ({
      ...addr,
      isDefault: index === addressIndex,
    }));
    
    return updateProfile({ addresses: updatedAddresses });
  }, [userProfile, updateProfile]);

  // Address utility methods
  const getShippingAddresses = useCallback((): Address[] => {
    if (!userProfile) return [];
    return getAddressesByType(userProfile.addresses, 'shipping');
  }, [userProfile]);

  const getBillingAddresses = useCallback((): Address[] => {
    if (!userProfile) return [];
    return getAddressesByType(userProfile.addresses, 'billing');
  }, [userProfile]);

  const getDefaultShippingAddress = useCallback((): Address | null => {
    if (!userProfile) return null;
    return getDefaultAddress(userProfile.addresses);
  }, [userProfile]);

  // Get current authenticated user
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      setLoading(true);
      // Get auth user
      const authUserData = await account.get();
      if (!authUserData) return null;
      
      setAuthUser(authUserData);
      
      // Get user profile
      const profile = await getUserProfile(authUserData.$id);
      
      const user: User = {
        auth: authUserData,
        profile,
      };
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      const appwriteError = error as AppwriteException;
      console.error('Failed to fetch current user:', appwriteError.message);
      
      // Clear invalid session
      if (appwriteError.code === 401) {
        await account.deleteSession('current').catch(() => {});
        setCurrentUser(null);
        setAuthUser(null);
        setUserProfile(null);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserProfile]);

  // Login user
  const login = useCallback(async (email: string, password: string): Promise<{ session: Models.Session; user: User }> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Create session
      const session = await account.createEmailPasswordSession(email, password);
      
      // Update last login time in accounts collection
      try {
        const authUserData = await account.get();
        await databases.updateDocument(
          ENV.DATABASE_ID,
          COLLECTIONS.ACCOUNTS,
          authUserData.$id,
          { lastLoginAt: new Date().toISOString() }
        );
      } catch (updateError) {
        console.warn('Failed to update last login time:', updateError);
        // Continue even if update fails
      }
      
      // Get user data
      const user = await getCurrentUser();
      if (!user) throw new Error('Failed to get user after login');
      
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
  const register = useCallback(async (userData: RegisterData): Promise<{ accountData: AuthUser; user: User }> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userData.email || !userData.password || !userData.fullName) {
        throw new Error('All required fields must be provided');
      }
      
      const { email, password, fullName, phone } = userData;
      
      // Create Appwrite account
      const accountData = await account.create(ID.unique(), email, password, fullName);
      
      // Create record in accounts collection
      const accountRecord = {
        name: fullName,
        email: email,
        phone: phone || '',
        status: true,
        isEmailVerified: false,
        labels: ['CUSTOMER'],
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
      };
      
      await databases.createDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        accountData.$id, // Use same ID as Auth user
        accountRecord
      );
      
      // Create user profile
      const profileData: CreateUserInformation = {
        userId: accountData.$id,
        fullName,
        phone: phone || '',
        addresses: [],
        preferences: DEFAULT_PREFERENCES,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const profile = await createProfile(profileData);
      
      const user: User = {
        auth: accountData,
        profile,
      };
      
      setCurrentUser(user);
      setAuthUser(accountData);
      
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
  }, [createProfile]);

  // Logout user
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await account.deleteSession('current');
      setCurrentUser(null);
      setAuthUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the local state
      setCurrentUser(null);
      setAuthUser(null);
      setUserProfile(null);
      throw new Error('Failed to logout');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async (): Promise<{ session: Models.Session; user: User } | null> => {
    try {
      const session = await account.getSession('current');
      if (session) {
        const user = await getCurrentUser();
        if (user) {
          return { session, user };
        }
      }
      return null;
    } catch (error) {
      setCurrentUser(null);
      setAuthUser(null);
      setUserProfile(null);
      return null;
    }
  }, [getCurrentUser]);

  // -------------------------------------------------------------------------
  // Admin – Users Management (basic stubs, replace with real API integration)
  // -------------------------------------------------------------------------
  const listUsers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Query the accounts collection from Appwrite database
      const response = await databases.listDocuments(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS
      );
      
      // Map database documents to UserAccount interface
      const userAccounts: UserAccount[] = response.documents.map((doc): UserAccount => ({
        $id: doc.$id,
        name: doc.name || doc.fullName || 'Unknown User',
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        status: doc.status ?? true,
        isEmailVerified: doc.isEmailVerified ?? false,
        labels: Array.isArray(doc.labels) ? doc.labels : ['CUSTOMER'],
        createdAt: doc.$createdAt || doc.createdAt,
        lastLoginAt: doc.lastLoginAt,
      }));
      
      setUsers(userAccounts);
    } catch (err) {
      console.error('Failed to list users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(async (query: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        await listUsers();
        return;
      }
      
      // Build Appwrite queries for different search types
      const queries: string[] = [];
      
      // Handle specific filter queries from UI chips
      if (query.includes('status.equal(true)')) {
        queries.push(Query.equal('status', true));
      } else if (query.includes('status.equal(false)')) {
        queries.push(Query.equal('status', false));
      } else if (query.includes('isEmailVerified.equal(true)')) {
        queries.push(Query.equal('isEmailVerified', true));
      } else if (query.includes('isEmailVerified.equal(false)')) {
        queries.push(Query.equal('isEmailVerified', false));
      } else if (query.includes('labels.contains("ADMIN")')) {
        queries.push(Query.contains('labels', 'ADMIN'));
      } else if (query.includes('labels.contains("MANAGER")')) {
        queries.push(Query.contains('labels', 'MANAGER'));
      } else if (query.includes('labels.contains("CUSTOMER")')) {
        queries.push(Query.contains('labels', 'CUSTOMER'));
      } else {
        // Text search in name and email
        queries.push(Query.search('name', query));
        // Note: Appwrite doesn't support OR queries easily, so we'll search name first
        // In a production app, you might want to do separate queries and combine results
      }
      
      const response = await databases.listDocuments(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        queries
      );
      
      // Map database documents to UserAccount interface
      const userAccounts: UserAccount[] = response.documents.map((doc): UserAccount => ({
        $id: doc.$id,
        name: doc.name || doc.fullName || 'Unknown User',
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        status: doc.status ?? true,
        isEmailVerified: doc.isEmailVerified ?? false,
        labels: Array.isArray(doc.labels) ? doc.labels : ['CUSTOMER'],
        createdAt: doc.$createdAt || doc.createdAt,
        lastLoginAt: doc.lastLoginAt,
      }));
      
      setUsers(userAccounts);
    } catch (err) {
      console.error('Failed to search users:', err);
      setError('Failed to search users');
      // Fall back to full list on error
      await listUsers();
    } finally {
      setLoading(false);
    }
  }, [listUsers]);

  const updateUser = useCallback(async (userId: string, data: UpdateUserData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Update user in accounts collection
      await databases.updateDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        userId,
        data
      );
      
      // If updating current user, also update Auth service
      if (userId === authUser?.$id) {
        try {
          // Update name in Auth if provided
          if (data.name && data.name !== authUser.name) {
            await account.updateName(data.name);
          }
          
          // Update email in Auth if provided (requires current password in production)
          if (data.email && data.email !== authUser.email) {
            // Note: In production, you'd need the user's current password
            // await account.updateEmail(data.email, currentPassword);
            console.warn('Email update in Auth requires current password');
          }
          
          // Update phone in Auth if provided
          if (data.phone !== undefined && data.phone !== authUser.phone) {
            await account.updatePhone(data.phone || '', ''); // Second param is password, empty for now
          }
          
          // Update preferences/labels in Auth
          if (data.labels) {
            const currentPrefs = authUser.prefs || {};
            await account.updatePrefs({
              ...currentPrefs,
              labels: data.labels,
              role: data.labels[0] || 'CUSTOMER'
            });
          }
          
          // Update status in preferences
          if (data.status !== undefined) {
            const currentPrefs = authUser.prefs || {};
            await account.updatePrefs({
              ...currentPrefs,
              isActive: data.status
            });
          }
          
          // Refresh current user data
          await getCurrentUser();
        } catch (authError) {
          console.warn('Failed to update Auth service:', authError);
          // Continue even if Auth update fails
        }
      }
      
      // Refresh the user list to reflect changes
      await listUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listUsers, authUser, account, getCurrentUser]);

  const deleteUser = useCallback(async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Prevent deleting current user
      if (userId === authUser?.$id) {
        throw new Error('Cannot delete your own account');
      }
      
      // Delete user from accounts collection
      await databases.deleteDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        userId
      );
      
      // Also delete user profile if exists
      try {
        const profileResponse = await databases.listDocuments(
          ENV.DATABASE_ID,
          COLLECTIONS.USER_INFORMATION,
          [Query.equal('userId', userId)]
        );
        
        if (profileResponse.documents.length > 0) {
          await databases.deleteDocument(
            ENV.DATABASE_ID,
            COLLECTIONS.USER_INFORMATION,
            profileResponse.documents[0].$id
          );
        }
      } catch (profileError) {
        console.warn('Failed to delete user profile:', profileError);
        // Continue even if profile deletion fails
      }
      
      // Note: Deleting from Appwrite Auth requires server-side admin SDK
      // This would typically be done through an admin API endpoint
      console.info(`User ${userId} removed from collections. Auth user deletion requires admin API.`);
      
      // Refresh the user list to reflect changes
      await listUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authUser?.$id, listUsers]);

  const updateUserRole = useCallback(async (userId: string, role: Labels): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Update user role in accounts collection
      await databases.updateDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        userId,
        { labels: [role] }
      );
      
      // If updating current user, also update Auth preferences
      if (userId === authUser?.$id) {
        try {
          const currentPrefs = authUser.prefs || {};
          await account.updatePrefs({
            ...currentPrefs,
            labels: [role],
            role: role
          });
          
          // Refresh current user data
          await getCurrentUser();
        } catch (authError) {
          console.warn('Failed to update Auth preferences for role:', authError);
        }
      }
      
      // Refresh the user list to reflect changes
      await listUsers();
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Failed to update user role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listUsers, authUser, account, getCurrentUser]);

  const updateUserStatus = useCallback(async (userId: string, status: boolean): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Update user status in accounts collection
      await databases.updateDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        userId,
        { status }
      );
      
      // If updating current user, also update Auth preferences
      if (userId === authUser?.$id) {
        try {
          const currentPrefs = authUser.prefs || {};
          await account.updatePrefs({
            ...currentPrefs,
            isActive: status,
            accountStatus: status ? 'active' : 'inactive'
          });
          
          // If disabling current user's account, logout
          if (!status) {
            console.warn('Current user account has been disabled');
            await logout();
            return;
          }
          
          // Refresh current user data
          await getCurrentUser();
        } catch (authError) {
          console.warn('Failed to update Auth preferences for status:', authError);
        }
      }
      
      // Refresh the user list to reflect changes
      await listUsers();
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listUsers, authUser, account, getCurrentUser, logout]);

  const verifyUserEmail = useCallback(async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Update email verification status in accounts collection
      await databases.updateDocument(
        ENV.DATABASE_ID,
        COLLECTIONS.ACCOUNTS,
        userId,
        { isEmailVerified: true }
      );
      
      // If verifying current user's email, also update Auth service
      if (userId === authUser?.$id) {
        try {
          // For current user, we can send verification email or mark as verified
          const currentPrefs = authUser.prefs || {};
          await account.updatePrefs({
            ...currentPrefs,
            emailVerified: true,
            verifiedAt: new Date().toISOString()
          });
          
          // Refresh current user data
          await getCurrentUser();
        } catch (authError) {
          console.warn('Failed to update Auth verification status:', authError);
        }
      }
      
      // Refresh the user list to reflect changes
      await listUsers();
    } catch (err) {
      console.error('Failed to verify user email:', err);
      setError('Failed to verify user email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listUsers, authUser, account, getCurrentUser]);

  const sendUserVerificationEmail = useCallback(async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // If sending to current user, use Auth service
      if (userId === authUser?.$id) {
        await account.createVerification(`${window.location.origin}/verify-email`);
        
        // Update database to track verification attempt
        await databases.updateDocument(
          ENV.DATABASE_ID,
          COLLECTIONS.ACCOUNTS,
          userId,
          { 
            verificationEmailSent: true,
            verificationEmailSentAt: new Date().toISOString()
          }
        );
      } else {
        // For other users, just update database 
        // (sending email to other users requires admin API)
        await databases.updateDocument(
          ENV.DATABASE_ID,
          COLLECTIONS.ACCOUNTS,
          userId,
          { 
            verificationEmailRequested: true,
            verificationEmailRequestedAt: new Date().toISOString()
          }
        );
        console.info(`Verification email request logged for user ${userId}. Actual sending requires admin API.`);
      }
      
      // Refresh the user list to reflect changes
      await listUsers();
    } catch (err) {
      console.error('Failed to send verification email:', err);
      setError('Failed to send verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listUsers, authUser, account]);

  // Memoize context value
  const contextValue = useMemo((): AccountContextType => ({
    // State
    currentUser,
    authUser,
    userProfile,
    loading,
    error,
    
    // Auth methods
    login,
    register,
    logout,
    
    // Profile management
    getUserProfile,
    updateProfile,
    createProfile,
    
    // Address management
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    getShippingAddresses,
    getBillingAddresses,
    getDefaultShippingAddress,
    
    // Utility methods
    refreshSession,
    getCurrentUser,
    
    // Password management
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
        await account.updateRecovery(userId, secret, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password reset failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    
    updatePassword: async (currentPassword: string, newPassword: string) => {
      try {
        setLoading(true);
        await account.updatePassword(newPassword, currentPassword);
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
        return user?.auth || authUser!;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Email update failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    
    sendVerificationEmail: async () => {
      if (!authUser) throw new Error('No user logged in');
      await account.createVerification(`${window.location.origin}/verify-email`);
    },
    
    verifyEmail: async (userId: string, secret: string) => {
      try {
        setLoading(true);
        await account.updateVerification(userId, secret);
        const user = await getCurrentUser();
        return user?.auth || authUser!;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Email verification failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    
    // Admin
    users,
    listUsers,
    searchUsers,
    updateUser,
    deleteUser,
    updateUserRole,
    updateUserStatus,
    verifyUserEmail,
    sendUserVerificationEmail,
  }), [
    currentUser, authUser, userProfile, loading, error,
    login, register, logout, getUserProfile, updateProfile, createProfile,
    addAddress, updateAddress, removeAddress, setDefaultAddress,
    getShippingAddresses, getBillingAddresses, getDefaultShippingAddress,
    refreshSession, getCurrentUser,
    users, listUsers, searchUsers, updateUser, deleteUser, updateUserRole, updateUserStatus, verifyUserEmail, sendUserVerificationEmail
  ]);

  // Auto-fetch user on mount
  useEffect(() => {
    getCurrentUser().catch(() => {
      // Silent fail - user not logged in
    });
  }, [getCurrentUser]);

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
}

// ------------------------------
// Admin User Management types
// ------------------------------
export type Labels = 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export interface UserAccount {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: boolean; // Active / Inactive
  isEmailVerified: boolean;
  labels: Labels[];
  createdAt?: string;
  lastLoginAt?: string;
}

export type UpdateUserData = Partial<Omit<UserAccount, '$id'>>;
