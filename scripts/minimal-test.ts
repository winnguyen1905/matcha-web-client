import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../.env') });

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_BD_BUCKET_APIKEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'default';

async function runTest() {
  console.log('🚀 Starting minimal test...');
  
  try {
    // List databases
    console.log('📋 Listing databases...');
    const dbs = await databases.list();
    console.log('Databases:', dbs);
    
    // List collections in the database
    console.log('\n📋 Listing collections...');
    const collections = await databases.listCollections(DATABASE_ID);
    console.log('Collections:', collections);
    
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTest();
