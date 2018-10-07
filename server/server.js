const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));

io.on('connection', (socket) => {

});

server.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});
