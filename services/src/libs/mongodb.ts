import mongoose, { Connection } from 'mongoose';
import { logger } from '@/shared/logger';

// See API docs: http://mongoosejs.com/docs/lambda.html
let cacheDB: Connection;

const MONGODB_URI =
  'mongodb://10.0.0.100:27017,10.0.0.101:27017,10.0.0.102:27017/database?replicaSet=rs0';

const getConnection = async (): Promise<Connection> => {
  if (cacheDB && cacheDB.readyState === 1) {
    logger.info('Reusing existing connection...');
    return cacheDB;
  }

  try {
    const mongo = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
    });

    cacheDB = mongo.connection;
    logger.info('Connected successfully to MongoDB!');

    return cacheDB;
  } catch (error) {
    logger.error('Could not connect to MongoDB...');
    throw error;
  }
};

export { getConnection };
