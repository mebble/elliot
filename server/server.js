const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const State = require('./state');
const state = new State();

const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));

io.on('connection', (socket) => {
    state.connections.push(socket);
    console.log(`Connected: ${state.connections.length} socket connected`);

    socket.on('join-room', (data, ack) => {
        state.joinRoom(socket, data, ack);
    });
    socket.on('introduction', (data, ack) => {
        state.introduction(socket, data, ack);
    });
    socket.on('editor-update', (data, ack) => {
        state.editorUpdate(socket, data, ack);
    });
    socket.on('disconnect', (data) => {
        state.disconnect(socket, data);
    });
});

server.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});
