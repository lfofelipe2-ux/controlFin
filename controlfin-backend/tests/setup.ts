import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Disconnect from MongoDB
  await mongoose.disconnect();
  
  // Stop the in-memory server
  if (mongod) {
    await mongod.stop();
  }
});

beforeEach(async () => {
  // Clean all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
