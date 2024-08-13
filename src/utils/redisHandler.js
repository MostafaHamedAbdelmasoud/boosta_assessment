import redisClient from "../DB/redis.js";


export const setNewDataInRedis = async (key, newObject) => {
  const records = await redisClient.get(key);
  if (records) {
    const parsedData = JSON.parse(records);
    parsedData.push(newObject);
    redisClient.setEx(key, 3600 * 24, JSON.stringify(parsedData));
  } else {
    redisClient.setEx(key, 3600 * 24, JSON.stringify([newObject]));
  }
};

export const readFromRedisAsArrayOfObject = async (key) => {
  const records = await redisClient.get(key);
  if (!records) {
    return [];
  }
  return JSON.parse(records);
};
