import { Client, Databases, ID } from 'node-appwrite';
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

async function createCollection(collectionId: string, name: string) {
  console.log(`\n🔄 Creating collection: ${name} (${collectionId})`);
  
  try {
    // Delete collection if it exists
    try {
      await databases.deleteCollection(DATABASE_ID, collectionId);
      console.log(`✅ Deleted existing collection: ${collectionId}`);
    } catch (error: any) {
      if (error.code !== 404) {
        throw error;
      }
    }
    
    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      collectionId,
      name
    );
    
    console.log(`✅ Created collection: ${collection.$id}`);
    return collection;
  } catch (error) {
    console.error(`❌ Error creating collection ${collectionId}:`, error);
    throw error;
  }
}

async function createStringAttribute(collectionId: string, key: string, size: number, required: boolean) {
  console.log(`\n  ➕ Adding string attribute: ${key}`);
  console.log(`  - Collection: ${collectionId}`);
  console.log(`  - Size: ${size}`);
  console.log(`  - Required: ${required}`);
  
  try {
    console.log('  - Sending request to create attribute...');
    const result = await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      key,
      size,
      required,
      '',
      false
    );
    
    console.log('  - Server response:', JSON.stringify(result, null, 2));
    console.log(`  ✅ Successfully added string attribute: ${key}`);
    return result;
  } catch (error: any) {
    console.error(`  ❌ Error adding string attribute ${key}:`);
    console.error('  - Error code:', error.code);
    console.error('  - Error type:', error.type);
    console.error('  - Error message:', error.message);
    console.error('  - Full error:', JSON.stringify(error, null, 2));
    throw error;
  }
}

async function createBooleanAttribute(collectionId: string, key: string, required: boolean) {
  console.log(`  ➕ Adding boolean attribute: ${key}`);
  try {
    await databases.createBooleanAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      false
    );
    console.log(`  ✅ Added boolean attribute: ${key}`);
  } catch (error) {
    console.error(`  ❌ Error adding boolean attribute ${key}:`, error);
    throw error;
  }
}

async function createFloatAttribute(collectionId: string, key: string, required: boolean, min?: number, max?: number) {
  console.log(`  ➕ Adding float attribute: ${key}${min !== undefined ? ` (min: ${min})` : ''}${max !== undefined ? ` (max: ${max})` : ''}`);
  try {
    await databases.createFloatAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      min,
      max
    );
    console.log(`  ✅ Added float attribute: ${key}`);
  } catch (error) {
    console.error(`  ❌ Error adding float attribute ${key}:`, error);
    throw error;
  }
}

async function createIntegerAttribute(collectionId: string, key: string, required: boolean, min?: number, max?: number) {
  console.log(`  ➕ Adding integer attribute: ${key}${min !== undefined ? ` (min: ${min})` : ''}${max !== undefined ? ` (max: ${max})` : ''}`);
  try {
    await databases.createIntegerAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      min,
      max
    );
    console.log(`  ✅ Added integer attribute: ${key}`);
  } catch (error) {
    console.error(`  ❌ Error adding integer attribute ${key}:`, error);
    throw error;
  }
}

async function createTestCollection() {
  const collectionId = 'test_products';
  
  try {
    console.log('🚀 Starting test collection creation...');
    
    // Create collection
    await createCollection(collectionId, 'Test Products');
    
    // Add delay to ensure collection is ready
    console.log('\n⏳ Waiting for collection to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test with minimal required parameters first
    console.log('\n🔍 Testing with minimal required parameters...');
    await createStringAttribute(collectionId, 'test_minimal', 100, true);
    
    // Test with all parameters
    console.log('\n🔍 Testing with all parameters...');
    await createStringAttribute(collectionId, 'test_full', 255, true);
    
    // Test with different sizes
    console.log('\n🔍 Testing with different sizes...');
    await createStringAttribute(collectionId, 'test_small', 10, false);
    await createStringAttribute(collectionId, 'test_large', 2000, false);
    
    console.log('\n🎉 Test collection created successfully!');
  } catch (error) {
    console.error('\n❌ Failed to create test collection:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error details:', error);
    }
  }
}

// Run the test
createTestCollection();
