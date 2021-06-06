const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));    

const botName = "Text-It Bot";

// Run when client will connect
io.on('connection', socket => {

     // Welcome curretn user
     socket.emit('message', formatMessage(botName,'Welcome to Text-It!'));

     // Runs when a client disconnects
     socket.on('disconnect', () => {
         io.emit('message', formatMessage(botName,'A User has left the chat'));
     });

     // Broadcast message when a user joins
     socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));

     // Listen for chatMessage
     socket.on('chatMessage', msg => {
         io.emit('message', formatMessage("USER",msg));
     });
});

const PORT =  3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port", PORT));