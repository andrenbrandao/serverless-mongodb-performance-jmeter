import mongoose, { Connection } from 'mongoose';
import { logger } from '@/shared/logger';

// See API docs: http://mongoosejs.com/docs/lambda.html
let cacheDB: Connection;
mongoose.set('strictQuery', false);

const MONGODB_URI =
  'mongodb://10.0.0.100:27017,10.0.0.101:27017,10.0.0.102:27017/database?replicaSet=rs0';

// MONGODB_URI = 'mongodb://127.0.0.1/database';

const getConnection = async (): Promise<Connection> => {
  if (cacheDB && cacheDB.readyState === 1) {
    logger.info('Reusing existing connection...');
    return cacheDB;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      bufferCommands: false, // Disable mongoose buffering
    });

    cacheDB = mongoose.connection;
    logger.info('Connected successfully to MongoDB!');

    return cacheDB;
  } catch (error) {
    logger.error('Could not connect to MongoDB...');
    throw error;
  }
};

export { getConnection };
