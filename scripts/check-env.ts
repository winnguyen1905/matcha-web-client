import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../.env') });

// Log environment variables
console.log('🚀 Environment Variables:');
console.log('------------------------');
console.log('VITE_APPWRITE_ENDPOINT:', process.env.VITE_APPWRITE_ENDPOINT);
console.log('VITE_APPWRITE_PROJECT_ID:', process.env.VITE_APPWRITE_PROJECT_ID ? '***' + process.env.VITE_APPWRITE_PROJECT_ID.slice(-4) : 'Not set');
console.log('VITE_APPWRITE_BD_BUCKET_APIKEY:', process.env.VITE_APPWRITE_BD_BUCKET_APIKEY ? '***' + process.env.VITE_APPWRITE_BD_BUCKET_APIKEY.slice(-4) : 'Not set');
console.log('VITE_APPWRITE_DATABASE_ID:', process.env.VITE_APPWRITE_DATABASE_ID || 'default');
console.log('------------------------');

// Check if required variables are set
const requiredVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_BD_BUCKET_APIKEY'
];

let allVarsSet = true;
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    allVarsSet = false;
  }
}

if (allVarsSet) {
  console.log('✅ All required environment variables are set');
} else {
  console.log('❌ Some required environment variables are missing');
  console.log('Please check your .env file and make sure it contains all required variables');
}
