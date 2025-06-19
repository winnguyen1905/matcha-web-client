import { Client, Account, Models } from 'appwrite';

// Types
type AppwriteConfig = {
  endpoint: string;
  projectId: string;
};

// Configuration - should be moved to environment variables in production
const config: AppwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || ''
};

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// Initialize Appwrite services
const account = new Account(client);

// Export types
export type { Models };
export { ID } from 'appwrite';

// Export services
export { client, account };

// Helper function to get the current user
export const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    await account.getSession('current');
    return true;
  } catch (error) {
    return false;
  }
};
