import mongoose from 'mongoose';
import { config } from '../config/index.js';

let connected = false;

export async function connectToDatabase() {
  if (connected) return;
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.databaseUri, {
    autoIndex: config.nodeEnv !== 'production'
  });
  connected = true;
}



