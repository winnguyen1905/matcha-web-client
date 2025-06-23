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
  const COLLECTION_ID = 'simple_test_collection';
  
  try {
    console.log('🚀 Starting simple test...');
    
    // Delete collection if it exists
    try {
      await databases.deleteCollection(DATABASE_ID, COLLECTION_ID);
      console.log('✅ Deleted existing collection');
    } catch (error) {
      if (error.code !== 404) {
        console.error('Error deleting collection:', error);
        return;
      }
    }
    
    // Create a new collection
    console.log('\n🔄 Creating collection...');
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Simple Test Collection'
    );
    console.log('✅ Created collection:', collection.$id);
    
    // Add a delay to ensure collection is ready
    console.log('\n⏳ Waiting for collection to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add a simple string attribute with detailed logging
    console.log('\n➕ Adding string attribute...');
    try {
      console.log('  - Sending request with parameters:');
      console.log('    - databaseId:', DATABASE_ID);
      console.log('    - collectionId:', COLLECTION_ID);
      console.log('    - key: test_field');
      console.log('    - size: 255');
      console.log('    - required: true');
      console.log('    - default: ""');
      console.log('    - array: false');
      
      const attribute = await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'test_field',
        255,    // size
        true,    // required
        '',       // default value
        false     // array
      );
      
      console.log('✅ Successfully added attribute:');
      console.log(JSON.stringify(attribute, null, 2));
    } catch (error) {
      console.error('❌ Failed to add attribute:');
      console.error('Error code:', error.code);
      console.error('Error type:', error.type);
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      // Try to get collection details to see its current state
      try {
        console.log('\n🔍 Checking collection state...');
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log('Collection state:', {
          id: collection.$id,
          name: collection.name,
          attributes: collection.attributes || []
        });
      } catch (colError) {
        console.error('Failed to get collection details:', colError.message);
      }
      
      throw error;
    }
    
    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error code:', error.code);
    console.error('Error type:', error.type);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

runTest();
