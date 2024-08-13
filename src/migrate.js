import { sequelize } from './DB/connection.js'; // Ensure you have the correct path to your database configuration

(async () => {
  try {
    
    // Synchronize all models
    await sequelize.sync(
      // { force: true }
    );
    console.log('Database synced!');

    console.log('Initial data created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();