import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB_NAME || "test";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function connectDB(): Promise<Db> {
  if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");
  
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
      clientPromise = client.connect();
    }
    
    if (clientPromise) {
      await clientPromise;
    }
    
    // Verify connection is still alive
    if (client) {
      await client.db(MONGODB_DB).admin().ping();
    }
    
    return client!.db(MONGODB_DB);
  } catch (error) {
    // Reset client on connection error
    client = null;
    clientPromise = null;
    throw error;
  }
}

export async function disconnectDB() {
  if (client) {
    await client.close();
    client = null;
    clientPromise = null;
  }
}
