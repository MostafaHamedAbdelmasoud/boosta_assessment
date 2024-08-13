// import redis from "redis";
// export const redisClient = redis.createClient(6379);

import { createClient } from 'redis';
const redis_port =6379;
const redis_host = 'redis';
const redisClient = createClient(
  {
    url: `redis://${redis_host}:${redis_port}`
  }
);

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.on("connect",()=>console.log("Redis Connected"));

// redisClient.connect();

export default redisClient;


