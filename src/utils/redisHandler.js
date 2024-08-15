import { redisClient } from "../DB/redis.js";

export const setNewDataInRedis = async (key, newObject) => {
  try {
    let records = await redisClient.get(key);

    if (!records) {
      console.log("No records found for key ", key);
      await redisClient.set(key, JSON.stringify([]));

      await redisClient.expire(key, 3600 * 24);
      records = JSON.stringify([]);
    }

    const parsedData = JSON.parse(records);
    parsedData.push(newObject);
    await redisClient.set(key, JSON.stringify(parsedData), "EX", 3600 * 24);
    return;
  } catch (error) {
    console.error(`Error getting value from Redis for key ${key}:`, error);
    throw error;
  }
};

export const deleteOneRecordFromRedis = async (key, id) => {
  try {
    const records = await redisClient.get(key);
    if (!records) {
      console.log(`No records found for key ${key}`);
      return;
    }

    const parsedData = JSON.parse(records);

    const updatedData = parsedData.filter((record) => {
      if (!record) {
        return false;
      }
      return record.id != id;
    });

    await redisClient.set(key, JSON.stringify(updatedData), "EX", 3600 * 24);

    console.log(`Record with id ${id} removed from Redis key ${key}`);
  } catch (error) {
    console.error(`Error removing value from Redis for key ${key}:`, error);
    throw error;
  }
};


export const updateOneRecordInRedis = async (key, id, updatedObject) => {
  await deleteOneRecordFromRedis(key, id);
  await setNewDataInRedis(key, updatedObject);
};

export const getAllRecordsInRedis = async (keyInRedis, modelName) => {
  let allCachedRecords = JSON.parse(await redisClient.get(keyInRedis)) ?? [];

  let recordsCountInDatabase = await modelName.count();
  if (allCachedRecords.length != recordsCountInDatabase) {
    console.log("recordsCountInDatabase ", recordsCountInDatabase);

    redisClient.set(keyInRedis, JSON.stringify(await modelName.findAll()));
    allCachedRecords = JSON.parse(await redisClient.get(keyInRedis)) ?? [];
  }
  return allCachedRecords;
};

export const flushAllRedisArray = async (key) => {
  const records = await redisClient.get(key);

  if (!records) {
    return [];
  }
  return JSON.parse(records);
};

export const deleteAllRedis = async () => {
  await redisClient.flushAll();
};
