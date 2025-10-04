import mongoose from 'mongoose';
import { env } from './env';

const MONGODB_URI = env.mongodbUri;

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    // eslint-disable-next-line no-console
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB disconnection error:', error);
  }
}
