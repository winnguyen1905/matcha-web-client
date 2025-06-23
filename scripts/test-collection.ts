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

// Helper function to log errors with more details
function logError(context: string, error: any) {
  console.error(`❌ Error ${context}:`, {
    message: error.message,
    code: error.code,
    type: error.type,
    response: error.response
  });
}

async function testCollection() {
  console.log('🚀 Starting test collection script...');
  console.log('Environment:', {
    endpoint: process.env.VITE_APPWRITE_ENDPOINT,
    projectId: process.env.VITE_APPWRITE_PROJECT_ID ? '***' : 'Not set',
    databaseId: DATABASE_ID
  });

  try {
    const collectionId = 'test_collection';
    
    // Try to delete the test collection if it exists
    try {
      console.log(`\n🔍 Checking if collection exists: ${collectionId}...`);
      await databases.getCollection(DATABASE_ID, collectionId);
      console.log(`🗑️  Collection exists, deleting...`);
      await databases.deleteCollection(DATABASE_ID, collectionId);
      console.log(`✅ Deleted existing collection: ${collectionId}`);
    } catch (error: any) {
      if (error.code === 404) {
        console.log('ℹ️  Collection does not exist, will create new one');
      } else {
        logError('deleting collection', error);
        return;
      }
    }
    
    // Create a new test collection
    console.log('\n🔄 Creating test collection...');
    try {
      const collection = await databases.createCollection(
        DATABASE_ID,
        collectionId,
        'Test Collection'
      );
      console.log('✅ Created test collection:', {
        id: collection.$id,
        name: collection.name,
        createdAt: collection.$createdAt
      });
    } catch (error) {
      logError('creating collection', error);
      return;
    }
    
    // Add a simple string attribute
    console.log('\n➕ Adding string attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        collectionId,
        'test_string',
        255,  // size
        true,  // required
        '',    // default value
        false  // array
      );
      console.log('✅ Added string attribute: test_string');
    } catch (error) {
      logError('adding string attribute', error);
      return;
    }
    
    // Add a number attribute with min/max
    console.log('\n➕ Adding number attribute...');
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        collectionId,
        'test_number',
        true,
        0,
        100
      );
      console.log('✅ Added number attribute: test_number (0-100)');
    } catch (error) {
      logError('adding number attribute', error);
      return;
    }
    
    console.log('\n🎉 Test completed successfully!');
    
    // List all collections to verify
    try {
      console.log('\n📋 Listing all collections...');
      const { collections } = await databases.listCollections(DATABASE_ID);
      console.log('Current collections:', collections.map(c => ({
        id: c.$id,
        name: c.name,
        attributes: c.attributes?.length || 0
      })));
    } catch (error) {
      logError('listing collections', error);
    }
  } catch (error) {
    logError('in test', error);
  }
}

testCollection();
