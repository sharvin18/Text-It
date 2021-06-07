const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { joinNewUser, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));    

const botName = "Text-It Bot";

// Run when client will connect
io.on('connection', socket => {

    // Fetching the username and room name
    socket.on('joinRoom', ({ username, room}) => {

        const user = joinNewUser(socket.id, username, room);

        socket.join(user.room);

        // Welcome curretn user
        socket.emit('message', formatMessage(botName,'Welcome to Text-It!'));

        // Broadcast message when a user joins
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));

    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when a client disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
        }
    });

});

const PORT =  3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port", PORT));