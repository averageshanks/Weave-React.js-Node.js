// Loading Modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const createError = require('http-errors');
const projectRoutes = require('./Router/projectroutes.js');
const cors = require('cors');
const cookieparser = require('cookie-parser');
dotenv.config();
const http = require('http');
const PORT = 8000;
const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Creating an express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    wss.clients.forEach((client) => {
      if (client != ws && client.readyState == WebSocket.OPEN) {
        client.send(data);
      }
    });
    const e = JSON.parse(data.toString());
    delete e.sender;
    const result = await prisma.message.create({
      data: e,
    });
    console.log(result);
  });
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: '*',
  })
);
app.use(cookieparser());

// Root route handler
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

//Routes
app.use(projectRoutes);
app.use('/api/v1/user', require('./Router/login.js'));

//Error middleware
app.use((req, res, next) => {
  next(createError.NotFound());
});

//Listening to the server
server.listen(PORT, (req, res) => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

module.exports = { server };
