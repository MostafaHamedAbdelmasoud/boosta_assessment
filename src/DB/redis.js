
import { createClient } from 'redis';

const redis_port =process.env.REDIS_PORT ;
const redis_host = process.env.REDIS_HOST;

const redisClient = createClient(
  {
    url: `redis://${redis_host}:${redis_port}`
  }
);

redisClient.on('error', (err) => console.error('Redis Client Error', err));
const connectRedis = async () => await redisClient.on("connect",()=>console.log("Redis Connected"));
connectRedis();

export {redisClient}


