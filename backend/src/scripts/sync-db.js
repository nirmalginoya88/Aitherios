require('dotenv').config();
const { sequelize } = require('../models');

const resetDatabase = async () => {
    try {
        console.log('Connecting to database and force syncing tables to clean up schema...');
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // force: true drops all tables and recreates them, setting up clean foreign keys and UUID schemas
        await sequelize.sync({ force: true });
        console.log('Database force synced successfully! All tables recreated cleanly.');
        process.exit(0);
    } catch (error) {
        console.error('Database reset failed:', error);
        process.exit(1);
    }
};

resetDatabase();
