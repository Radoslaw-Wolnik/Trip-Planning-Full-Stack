import app from './app.js';
import connectDB from './utils/db-connection.util.js';
import env from './config/environment.js';

const PORT = env.app.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${env.app.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

startServer();
