/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnection } from '@/libs/mongodb';
import { logger } from '@/shared/logger';

jest.mock('@/libs/mongodb');
const mockedGetConnection = getConnection as jest.MockedFunction<
  typeof getConnection
>;

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

let mongoServer: MongoMemoryServer;
const opts: ConnectOptions = {
  autoIndex: true,
  bufferCommands: false, // Disable mongoose buffering
};
mongoose.set('strictQuery', false);

const connect = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create({
    instance: { dbName: 'mongodb-test' },
  });
  const mongoUri = await mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri, opts);

    mockedGetConnection.mockResolvedValue(mongoose.connection);
  } catch (err) {
    logger.error(err);
  }
};

const disconnect = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clearDatabase = async (): Promise<void> => {
  const { collections } = mongoose.connection;

  const promises = Object.values(collections).map((collection) =>
    collection.deleteMany({}),
  );

  await Promise.all(promises);
};

export { connect, disconnect, clearDatabase };
