import {
  Client,
  Databases,
  ID,
  Query,
  type Models,
  IndexType,
} from "node-appwrite";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, "../.env") });



// -----------------------------    MOCK TEST IF ERROR HAPPENED
// REPLACE WITH ACTUAL COLLECTION ID FROM APPWRITE
const COLLECTIONS = {
  USER_INFORMATION: "user_information",
  TAX_RATES: "tax_rates",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
  DISCOUNTS: "discounts",
  DISCOUNT_USAGE: "discount_usage",
  USER_DISCOUNTS: "user_discounts",
} as const;

// EXAMPLE 
// const COLLECTIONS = {
//   TAX_RATES: 'tax_rates' ,
//   ORDERS: 'orders',
//   ORDER_ITEMS: 'order_items',
//   DISCOUNTS: 'discounts',
//   DISCOUNT_USAGE: 'discount_usage',
//   USER_DISCOUNTS: 'user_discounts',
// } as const;

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(
    process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.VITE_APPWRITE_BD_BUCKET_APIKEY || "");

const databases = new Databases(client);

// Database ID from environment or use default
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || "default";



// Collection attributes
const collectionAttributes: Record<string, any> = {
  [COLLECTIONS.USER_INFORMATION]: [
    { key: "userId", type: "string", size: 36, required: true },
    { key: "fullName", type: "string", size: 100, required: true },
    { key: "phone", type: "string", size: 20, required: false },
    { key: "avatarUrl", type: "string", size: 500, required: false },
    { key: "dateOfBirth", type: "string", size: 20, required: false },
    { key: "gender", type: "string", size: 20, required: false },
    { key: "addresses", type: "json", required: false },
    { key: "preferences", type: "json", required: false },
    { key: "isActive", type: "boolean", required: false, default: true },
    { key: "createdAt", type: "string", size: 100, required: true },
    { key: "updatedAt", type: "string", size: 100, required: true },
  ],
  [COLLECTIONS.TAX_RATES]: [
    { key: "name", type: "string", size: 100, required: true },
    { key: "rate", type: "double", required: true, min: 0.0, max: 100.0 },
    { key: "country", type: "string", size: 100, required: false },
    { key: "state", type: "string", size: 100, required: false },
    { key: "zipCode", type: "string", size: 20, required: false },
    { key: "isActive", type: "boolean", required: false, default: true },
    {
      key: "appliesToShipping",
      type: "boolean",
      required: false,
      default: false,
    },
    { key: "priority", type: "integer", required: true, min: 0, max: 100 },
    { key: "description", type: "string", size: 500, required: false },
  ],
  [COLLECTIONS.ORDERS]: [
    { key: "orderCode", type: "string", size: 50, required: true },
    { key: "userId", type: "string", size: 36, required: true },
    { key: "status", type: "string", size: 20, required: true },
    {
      key: "subtotal",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    {
      key: "taxAmount",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    {
      key: "discountTotal",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    {
      key: "shippingAmount",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    {
      key: "finalPrice",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    { key: "currency", type: "string", size: 3, required: true },
    { key: "paymentMethod", type: "string", size: 50, required: true },
    { key: "paymentStatus", type: "string", size: 20, required: true },
    { key: "shippingAddress", type: "json", required: true },
    { key: "billingAddress", type: "json", required: false },
    { key: "discountCode", type: "string", size: 50, required: false },
    { key: "ipAddress", type: "string", size: 45, required: false },
    { key: "userAgent", type: "string", size: 500, required: false },
    { key: "createdAt", type: "string", size: 100, required: true },
  ],
  [COLLECTIONS.ORDER_ITEMS]: [
    { key: "orderId", type: "string", size: 36, required: true },
    { key: "productId", type: "string", size: 36, required: true },
    { key: "productVariantId", type: "string", size: 36, required: true },
    { key: "quantity", type: "integer", required: true, min: 1, max: 1000 },
    {
      key: "unitPrice",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    { key: "total", type: "double", required: true, min: 0.0, max: 1000000.0 },
    {
      key: "discountAmount",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
  ],
  [COLLECTIONS.DISCOUNTS]: [
    { key: "code", type: "string", size: 50, required: true },
    { key: "description", type: "string", size: 500, required: false },
    { key: "discountType", type: "string", size: 20, required: true },
    { key: "value", type: "double", required: true, min: 0.0, max: 1000000.0 },
    {
      key: "minOrderAmount",
      type: "double",
      required: false,
      min: 0.0,
      max: 1000000.0,
    },
    {
      key: "maxDiscountAmount",
      type: "double",
      required: false,
      min: 0.0,
      max: 1000000.0,
    },
    { key: "startDate", type: "string", size: 100, required: true },
    { key: "endDate", type: "string", size: 100, required: true },
    { key: "isActive", type: "boolean", required: false, default: true },
    {
      key: "usageLimit",
      type: "integer",
      required: false,
      min: 1,
      max: 1000000,
    },
    {
      key: "usageCount",
      type: "integer",
      required: false,
      default: 0,
      min: 0,
      max: 1000000,
    },
    { key: "appliesTo", type: "json", required: true },
    { key: "createdBy", type: "string", size: 36, required: true },
  ],
  [COLLECTIONS.DISCOUNT_USAGE]: [
    { key: "discountId", type: "string", size: 36, required: true },
    { key: "userId", type: "string", size: 36, required: true },
    { key: "orderId", type: "string", size: 36, required: true },
    {
      key: "orderTotal",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    {
      key: "discountAmount",
      type: "double",
      required: true,
      min: 0.0,
      max: 1000000.0,
    },
    { key: "usedAt", type: "string", size: 100, required: true },
    { key: "usageStatus", type: "string", size: 20, required: true },
  ],
  [COLLECTIONS.USER_DISCOUNTS]: [
    { key: "userId", type: "string", size: 36, required: true },
    { key: "discountId", type: "string", size: 36, required: true },
    { key: "createdAt", type: "string", size: 100, required: true },
  ],
};

// Indexes configuration
const collectionIndexes: Record<string, any[]> = {
  [COLLECTIONS.USER_INFORMATION]: [
    { key: "idx_userId", type: "unique", attributes: ["userId"] },
    { key: "idx_isActive", type: "key", attributes: ["isActive"] },
    { key: "idx_createdAt", type: "key", attributes: ["createdAt"] },
  ],
  [COLLECTIONS.ORDERS]: [
    { key: "idx_userId", type: "key", attributes: ["userId"] },
    { key: "idx_status", type: "key", attributes: ["status"] },
    { key: "idx_createdAt", type: "key", attributes: ["createdAt"] },
  ],
  [COLLECTIONS.DISCOUNTS]: [
    { key: "idx_code", type: "unique", attributes: ["code"] },
    { key: "idx_isActive", type: "key", attributes: ["isActive"] },
  ],
  [COLLECTIONS.DISCOUNT_USAGE]: [
    { key: "idx_discountId", type: "key", attributes: ["discountId"] },
    { key: "idx_userId", type: "key", attributes: ["userId"] },
    { key: "idx_orderId", type: "unique", attributes: ["orderId"] },
  ],
  [COLLECTIONS.USER_DISCOUNTS]: [
    { key: "idx_userId", type: "key", attributes: ["userId"] },
    { key: "idx_discountId", type: "key", attributes: ["discountId"] },
    {
      key: "idx_user_discount",
      type: "unique",
      attributes: ["userId", "discountId"],
    },
  ],
};

async function dropCollection(collectionId: string) {
  try {
    await databases.deleteCollection(DATABASE_ID, collectionId);
    console.log(`>>>>>>>> Dropped collection: ${collectionId}`);
  } catch (error: any) {
    if (error.code !== 404) {
      // Ignore 404 errors (collection doesn't exist)
      throw error;
    }
  }
}

// Helper function to wait for attribute to be available
async function waitForAttribute(
  collectionId: string,
  attributeKey: string,
  maxRetries = 10
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await databases.getAttribute(DATABASE_ID, collectionId, attributeKey);
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  return false;
}

// Enable debug logging
process.env.DEBUG = "appwrite";

async function setupDatabase() {
  try {
    // Check if database exists, create if not
    try {
      console.log("\n===== Checking if database exists =====");
      const db = await databases.get(DATABASE_ID);
      console.log(`✅ Database ${DATABASE_ID} already exists:`, db.$id);
    } catch (error: any) {
      if (error.code === 404) {
        console.log(`>>>>>> Creating database: ${DATABASE_ID}...`);
        await databases.create(DATABASE_ID, "Matcha Shop");
        console.log(`>>>>>> Created database: ${DATABASE_ID}`);
      } else {
        console.error("Error checking/creating database:", error);
        throw error;
      }
    }

    // Drop existing collections first
    console.log("\n===== Dropping existing collections =====");
    for (const [name, collectionId] of Object.entries(COLLECTIONS)) {
      console.log(`\n🔽 Dropping collection: ${name} (${collectionId})`);
      try {
        await dropCollection(collectionId);
        console.log(`✅ Successfully dropped collection: ${name}`);
      } catch (error) {
        console.error(`❌ Error dropping collection ${name}:`, error.message);
      }
    }

    // Create collections
    console.log("\n===== Creating collections =====");
    for (const [collectionName, collectionId] of Object.entries(COLLECTIONS)) {
      console.log(
        `\n🔼 Creating collection: ${collectionName} (${collectionId})`
      );
      console.log(
        `\n>>>>>> Processing collection: ${collectionName} (${collectionId})`
      );
      try {
        // Try to get the collection
        const collection = await databases.getCollection(
          DATABASE_ID,
          collectionId
        );
        console.log(
          `>>>>>>>> Collection ${collectionId} already exists, skipping...`
        );

        // TODO: Update collection attributes if needed
        // This is a complex operation as Appwrite doesn't directly support updating attributes
        // You might need to create a new collection and migrate data
      } catch (error: any) {
        if (error.code === 404) {
          // Collection doesn't exist, create it
          const collection = await databases.createCollection(
            DATABASE_ID,
            collectionId,
            collectionName
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
          );

          console.log(`>>>>>>>> Created collection: ${collectionId}`);

          // Add attributes
          const attributes = collectionAttributes[collectionId] || [];
          for (const attr of attributes) {
            try {
              if (attr.type === "integer") {
                if (
                  typeof attr.min === "number" &&
                  typeof attr.max === "number"
                ) {
                  await databases.createIntegerAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required || false,
                    attr.min,
                    attr.max,
                    attr.default,
                    attr.array || false
                  );
                } else if (typeof attr.min === "number") {
                  await databases.createIntegerAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required || false,
                    attr.min,
                    undefined,
                    attr.default,
                    attr.array || false
                  );
                } else {
                  await databases.createIntegerAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required || false,
                    undefined,
                    undefined,
                    attr.default,
                    attr.array || false
                  );
                }
              } else if (attr.type === "double") {
                if (
                  typeof attr.min === "number" &&
                  typeof attr.max === "number"
                ) {
                  await databases.createFloatAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required || false,
                    attr.min,
                    attr.max,
                    attr.default,
                    attr.array || false
                  );
                } else if (typeof attr.min === "number") {
                  await databases.createFloatAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required || false,
                    attr.min,
                    undefined,
                    attr.default,
                    attr.array || false
                  );
                } else {
                  await databases.createFloatAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required || false,
                    undefined,
                    undefined,
                    attr.default,
                    attr.array || false
                  );
                }
              } else if (attr.type === "boolean") {
                await databases.createBooleanAttribute(
                  DATABASE_ID,
                  collectionId,
                  attr.key,
                  attr.required || false,
                  attr.default,
                  attr.array || false
                );
              } else if (attr.type === "json") {
                await databases.createStringAttribute(
                  DATABASE_ID,
                  collectionId,
                  attr.key,
                  5000, // Max size for JSON
                  attr.required || false,
                  attr.default,
                  false
                );
              } else if (attr.type === "string") {
                await databases.createStringAttribute(
                  DATABASE_ID,
                  collectionId,
                  attr.key,
                  attr.size || 255,
                  attr.required || false,
                  attr.default,
                  attr.array || false
                );
              }
              console.log(
                `  - Added attribute: ${attr.key} (${attr.type}${attr.required ? ", required" : ""
                }${attr.min !== undefined ? `, min: ${attr.min}` : ""}${attr.max !== undefined ? `, max: ${attr.max}` : ""
                }${attr.default !== undefined ? `, default: ${attr.default}` : ""
                })`
              );

              // Add a small delay between attribute creation
              await new Promise((resolve) => setTimeout(resolve, 300));
            } catch (error: any) {
              if (error.code !== 409) {
                // Ignore duplicate attribute errors
                console.error(
                  `  - Error adding attribute ${attr.key}:`,
                  error.message
                );
              }
            }
          }

          // Add a longer delay to ensure all attributes are fully created and available
          console.log("  - Waiting for attributes to be ready...");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Add indexes with proper attribute checking
          const indexes =
            collectionIndexes[collectionId as keyof typeof collectionIndexes] ||
            [];
          for (const index of indexes) {
            try {
              // Wait for all attributes in the index to be available
              console.log(`  - Checking attributes for index ${index.key}...`);
              const attributesReady = await Promise.all(
                index.attributes.map(async (attr) => {
                  const isReady = await waitForAttribute(collectionId, attr);
                  if (!isReady) {
                    console.log(`    - Attribute ${attr} not ready`);
                  }
                  return isReady;
                })
              );

              if (attributesReady.every((ready) => ready)) {
                // Use the correct index type from Appwrite enums
                const indexType =
                  index.type === "unique" ? IndexType.Unique : IndexType.Key;

                await databases.createIndex(
                  DATABASE_ID,
                  collectionId,
                  index.key,
                  indexType,
                  index.attributes
                );
                console.log(`  - Added index: ${index.key} (${index.type})`);
              } else {
                console.log(
                  `  - Skipping index ${index.key}: required attributes not ready`
                );
              }
            } catch (error: any) {
              console.error(
                `  - Failed to add index ${index.key}:`,
                error.message
              );
            }
          }
        } else {
          console.error(`Error checking collection ${collectionId}:`, error);
        }
      }
    }

    console.log("\n🎉 Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
