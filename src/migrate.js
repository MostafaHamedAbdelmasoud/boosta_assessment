import { sequelize } from './DB/connection.js';
import mysql from 'mysql2/promise';

(async () => {
  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, 
      user: process.env.DB_USER, 
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT, 
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS bosta');
    console.log('Database created or already exists.');

    await connection.end();

    await sequelize.sync(
      // { force: true }
    );
    console.log('Database synced!');

    console.log('Initial data created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();