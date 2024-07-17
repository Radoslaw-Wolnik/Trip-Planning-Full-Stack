const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const { sequelize } = require('.');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const websiteRoutes = require('./routes/websiteRoutes');
app.use('/api/data', websiteRoutes);

const PORT = process.env.PORT || 5001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


app.get('/', (req, res) => {
    res.send('Hello from backend!');
  });

// Socket.io setup
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  const io = socketIo(server);
  
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('message', (data) => {
      io.sockets.emit('message', data);
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
