import app from './app.js';
import connectDB from './config/database.js';
import env from './config/environment.js';

const PORT = env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});