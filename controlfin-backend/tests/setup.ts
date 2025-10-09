import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;
let isConnected = false;

// Clear all models before each test to prevent overwrite errors
beforeEach(async () => {
  // Clear all models to prevent OverwriteModelError
  Object.keys(mongoose.models).forEach(key => {
    delete mongoose.models[key];
  });
  
  // Clear all schemas
  Object.keys(mongoose.schemas).forEach(key => {
    delete mongoose.schemas[key];
  });
});

beforeAll(async () => {
  // Only connect if not already connected
  if (!isConnected) {
    try {
      // Start in-memory MongoDB with increased timeout
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'test-controlfin',
        },
        binary: {
          version: '7.0.0', // Use stable version
        },
      });
      const uri = mongod.getUri();
      
      // Connect to in-memory database with increased timeout
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
        bufferCommands: false,
        bufferMaxEntries: 0,
      });
      isConnected = true;
    } catch (error) {
      console.error('Failed to connect to MongoDB Memory Server:', error);
      throw error;
    }
  }
});

afterAll(async () => {
  // Disconnect from MongoDB
  if (isConnected) {
    try {
      await mongoose.disconnect();
      isConnected = false;
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }
  
  // Stop the in-memory server
  if (mongod) {
    try {
      await mongod.stop();
    } catch (error) {
      console.error('Error stopping MongoDB Memory Server:', error);
    }
  }
});

afterEach(async () => {
  // Clean all collections after each test
  if (isConnected) {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    } catch (error) {
      console.error('Error cleaning collections:', error);
    }
  }
});
