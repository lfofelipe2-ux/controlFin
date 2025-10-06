import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;
let isConnected = false;

beforeAll(async () => {
  // Only connect if not already connected
  if (!isConnected) {
    // Start in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Connect to in-memory database
    await mongoose.connect(uri);
    isConnected = true;
  }
});

afterAll(async () => {
  // Disconnect from MongoDB
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
  
  // Stop the in-memory server
  if (mongod) {
    await mongod.stop();
  }
});

beforeEach(async () => {
  // Clean all collections before each test
  if (isConnected) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});
