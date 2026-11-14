import mongoose from 'mongoose';

let isConnected = false;
let isGuestMode = true;

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim() === '') {
    console.log('ℹ️  MongoDB URI not configured. Running in Guest Mode (In-Memory storage).');
    isGuestMode = true;
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    isGuestMode = false;
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed (${error.message}). Falling back to Guest Mode (In-Memory storage).`);
    isConnected = false;
    isGuestMode = true;
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  guestMode: isGuestMode,
  mode: isGuestMode ? 'Guest (In-Memory)' : 'MongoDB Connected'
});
