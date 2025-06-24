// scripts/seedDiscounts.ts
// -----------------------------------------------------------------------------
// Seed initial Discount data into Appwrite.
// Run with:  npx ts-node scripts/seedDiscounts.ts   (after `npm i appwrite dotenv ts-node`)
// -----------------------------------------------------------------------------

import { Client, Databases, ID, Query } from "appwrite";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { COLLECTIONS_SEED } from "../const-common.js";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import schema types
import {
  DiscountType,
  CreateDiscount,
} from "../../src/lib/schema.js";


// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// -----------------------------------------------------------------------------
// 1️⃣  Environment variables validation
// -----------------------------------------------------------------------------
const requiredEnvVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'DB_BUCK_DEV_APIKEY',
  'VITE_APPWRITE_DATABASE_ID'
];
 

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  process.exit(1);
}

// -----------------------------------------------------------------------------
// 2️⃣  Create Appwrite client & Databases instance
// -----------------------------------------------------------------------------
const client = new Client();
client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '');

// Set API key if provided
const apiKey = process.env.DB_BUCK_DEV_APIKEY;
if (apiKey) {
  client.setDevKey(apiKey);
}

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'default';
const DISCOUNTS_COLLECTION_ID = COLLECTIONS_SEED.DISCOUNTS;

// -----------------------------------------------------------------------------
// 3️⃣  Helper to build date strings quickly
// -----------------------------------------------------------------------------
const daysFromNow = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString();

// -----------------------------------------------------------------------------
// 4️⃣  Seed data (feel free to tweak or add more!)
// -----------------------------------------------------------------------------
const seedDiscounts: CreateDiscount[] = [
  {
    code: "WELCOME10",
    description: "10% off your first order (site‑wide)",
    discountType: DiscountType.PERCENTAGE,
    value: 10,
    minOrderAmount: 0,
    maxDiscountAmount: undefined,
    startDate: daysFromNow(-1),
    endDate: daysFromNow(180),
    isActive: true,
    usageLimit: 10000,
    appliesTo: { allProducts: true },
    createdBy: "admin",
  },
  {
    code: "SUMMER20",
    description: "20% off all apparel – summer promo",
    discountType: DiscountType.PERCENTAGE,
    value: 20,
    minOrderAmount: 50,
    maxDiscountAmount: 50,
    startDate: daysFromNow(-7),
    endDate: "2025-09-30T23:59:59.000Z",
    isActive: true,
    usageLimit: 5000,
    appliesTo: {
      allProducts: false,
      categoryIds: ["cat_apparel"],
    },
    createdBy: "admin",
  },
  {
    code: "FREESHIP",
    description: "$5 off to cover shipping fees (orders >= $25)",
    discountType: DiscountType.FIXED,
    value: 5,
    minOrderAmount: 25,
    maxDiscountAmount: undefined,
    startDate: daysFromNow(-1),
    endDate: daysFromNow(365),
    isActive: true,
    usageLimit: undefined,
    appliesTo: { allProducts: true },
    createdBy: "admin",
  },
  {
    code: "BOGO50",
    description: "50% off selected accessories (limit 1 per order)",
    discountType: DiscountType.PERCENTAGE,
    value: 50,
    maxDiscountAmount: undefined,
    minOrderAmount: 0,
    startDate: daysFromNow(-1),
    endDate: daysFromNow(60),
    isActive: true,
    usageLimit: 1,
    appliesTo: {
      allProducts: false,
      productIds: ["prod_101", "prod_102"],
    },
    createdBy: "admin",
  },
  {
    code: "VIP30",
    description: "Exclusive 30% discount for VIP members",
    discountType: DiscountType.PERCENTAGE,
    value: 30,
    minOrderAmount: 100,
    maxDiscountAmount: 200,
    startDate: daysFromNow(-30),
    endDate: daysFromNow(365),
    isActive: true,
    usageLimit: 500,
    appliesTo: { allProducts: true },
    createdBy: "admin",
  },
  {
    code: "FLASH15",
    description: "⚡ 24‑hour flash sale – 15% off site‑wide",
    discountType: DiscountType.PERCENTAGE,
    value: 15,
    minOrderAmount: 0,
    maxDiscountAmount: undefined,
    startDate: daysFromNow(0),
    endDate: daysFromNow(1),
    isActive: true,
    usageLimit: 10000,
    appliesTo: { allProducts: true },
    createdBy: "admin",
  },
];

// -----------------------------------------------------------------------------
// 5️⃣  Main runner
// -----------------------------------------------------------------------------
(async () => {
  console.log(`🚀  Seeding ${seedDiscounts.length} discounts…`);

  for (const disc of seedDiscounts) {
    try {
      // Check if code already exists to avoid duplicates in dev reruns
      const existing = await databases.listDocuments(
        DATABASE_ID,
        DISCOUNTS_COLLECTION_ID,
        [Query.equal("code", disc.code)]
      );

      if (existing.total > 0) {
        console.log(`↪️  Discount ${disc.code} already exists – skipping.`);
        continue;
      }

      const payload = {
        ...disc,
        $id: ID.unique(),
        usageCount: 0,
        appliesTo: JSON.stringify(disc.appliesTo), // stored as JSON string per schema
      };

      await databases.createDocument(
        DATABASE_ID,
        DISCOUNTS_COLLECTION_ID,
        payload.$id,
        payload
      );

      console.log(`✅  Created ${disc.code}`);
    } catch (err) {
      console.error(`❌  Failed to create ${disc.code}:`, err);
    }
  }

  console.log("🎉  Seeding complete!");
})();
