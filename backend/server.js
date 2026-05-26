require('dotenv').config();

// Prevent silent crashes from unhandled errors
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException] Server will continue running:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection] Server will continue running:', reason);
});
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sync models if needed (be careful with force: true in production!)
    try {
      await sequelize.sync({ alter: true })
        .then(() => console.log("Database synced with new columns!"))
        .catch(err => console.log("Sync error:", err));
    } catch (syncError) {
      console.error('Database sync failed, but starting server anyway:', syncError);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
