import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/usersRoutes.js';
import roadtripRoutes from './routes/roadtripRoutes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/roadtrips', roadtripRoutes);

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

export default app;
