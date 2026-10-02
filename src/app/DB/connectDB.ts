// src/app/DB/connectDB.ts

import mongoose from 'mongoose';
import config from '../config';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const db = await mongoose.connect(config.database_url as string);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};
