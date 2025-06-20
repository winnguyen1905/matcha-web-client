import { Client, Account, Databases, Storage, Models } from 'appwrite';

// Types
type AppwriteConfig = {
  endpoint: string;
  projectId: string;
  apiKey: string;
};

// Configuration - should be moved to environment variables in production
const config: AppwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '',
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY || ''
};

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// For server-side operations, set the API key in the headers if it exists
if (config.apiKey) {
  client.headers['X-Appwrite-Key'] = config.apiKey;
}

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';

export const COLLECTIONS = {
  IDEAS: 'ideas',
  // Add other collections as needed
};
  
export const BUCKETS = {
  IDEAS_IMAGES: 'ideas_images',
  // Add other buckets as needed
};

// Export types
export type { Models };
export { ID } from 'appwrite';

// Export client
export { client };

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
