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

async function testConnection() {
  console.log('🚀 Testing Appwrite connection...');
  console.log('Endpoint:', client.config.endpoint);
  console.log('Project ID:', client.config.project ? '***' + client.config.project.slice(-4) : 'Not set');
  console.log('API Key:', client.config.key ? '***' + client.config.key.slice(-4) : 'Not set');
  
  try {
    // Test API key by listing databases
    console.log('\n🔍 Listing databases...');
    const dbs = await databases.list();
    console.log('✅ Successfully connected to Appwrite');
    console.log('Databases:', dbs);
    
    // List collections in the database
    try {
      console.log('\n📋 Listing collections...');
      const { collections } = await databases.listCollections(DATABASE_ID);
      console.log(`Found ${collections.length} collections in database ${DATABASE_ID}:`);
      collections.forEach((col: any) => {
        console.log(`- ${col.name} (${col.$id})`);
      });
    } catch (colError) {
      console.error('❌ Error listing collections:', colError);
    }
    
  } catch (error: any) {
    console.error('❌ Failed to connect to Appwrite:');
    console.error('Error code:', error.code);
    console.error('Error type:', error.type);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testConnection();
