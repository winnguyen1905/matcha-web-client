import { Client, Databases } from 'node-appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_BD_BUCKET_APIKEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'default';

// Helper function to log errors with details
function logError(context: string, error: any) {
  console.error(`❌ Error ${context}:`);
  console.error('  - Message:', error.message);
  console.error('  - Code:', error.code);
  console.error('  - Type:', error.type);
  
  if (error.response) {
    console.error('  - Status:', error.response.status);
    console.error('  - Data:', error.response.data);
  }
  
  if (error.request) {
    console.error('  - Request:', error.request);
  }
}

async function test() {
  try {
    console.log('🚀 Testing Appwrite connection...');
    console.log('  - Endpoint:', client.config.endpoint);
    console.log('  - Project ID:', client.config.project ? '***' + client.config.project.slice(-4) : 'Not set');
    console.log('  - API Key:', client.config.key ? '***' + client.config.key.slice(-4) : 'Not set');
    
    // List databases
    console.log('\n🔍 Listing databases...');
    try {
      const dbs = await databases.list();
      console.log('✅ Connected to Appwrite');
      console.log('  - Total databases:', dbs.total);
      dbs.databases.forEach((db: any) => {
        console.log(`    - ${db.name} (${db.$id})`);
      });
    } catch (error) {
      logError('listing databases', error);
      throw error;
    }
    
    // Create a test collection
    const collectionId = 'minimal_test_' + Date.now();
    console.log(`\n🔄 Creating collection: ${collectionId}`);
    
    // Delete if exists
    try {
      console.log(`  - Checking if collection exists...`);
      await databases.getCollection(DATABASE_ID, collectionId);
      console.log(`  - Collection exists, deleting...`);
      await databases.deleteCollection(DATABASE_ID, collectionId);
      console.log('✅ Deleted existing collection');
      
      // Small delay after deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      if (error.code === 404) {
        console.log('ℹ️  Collection does not exist, will create new one');
      } else {
        logError('checking/deleting collection', error);
        throw error;
      }
    }
    
    // Create collection
    console.log(`  - Creating collection...`);
    try {
      const collection = await databases.createCollection(
        DATABASE_ID,
        collectionId,
        'Minimal Test Collection',
        [],  // permissions - empty array for no permissions
        true // document level permissions
      );
      console.log('✅ Created collection:', collection.$id);
      
      // Add a small delay to ensure collection is ready
      console.log('⏳ Waiting for collection to be ready...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      logError('creating collection', error);
      throw error;
    }
    
    // Add a simple string attribute
    console.log('\n➕ Adding string attribute...');
    try {
      console.log('  - Sending request to create attribute...');
      const attribute = await databases.createStringAttribute(
        DATABASE_ID,
        collectionId,
        'name',
        100,    // size
        true,   // required
        '',     // default value
        false   // array
      );
      console.log('✅ Added attribute:');
      console.log(JSON.stringify(attribute, null, 2));
    } catch (error) {
      logError('adding string attribute', error);
      
      // Try to get collection details to see its current state
      try {
        console.log('\n🔍 Checking collection state...');
        const collection = await databases.getCollection(DATABASE_ID, collectionId);
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
    console.error('❌ Test failed:', error);
  }
}

test();
