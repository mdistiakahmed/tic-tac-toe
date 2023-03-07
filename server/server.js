const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const Socket = require('./controllers/socketController');

const connectDB = require('./config/db');
const statusRoutes = require('./routes/statusRoutes');


const app = express();
const server = http.Server(app);
const io = socketio(server);

connectDB();


app.use(cors());
app.use("/api/v1", statusRoutes);

new Socket(io).socketEvents();



const PORT = 3000 || process.env.PORT;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

