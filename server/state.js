const MAX_ROOMIES = 2;

class State {
    constructor() {
        this.connections = [];  // Socket[]: all connections
        this.rooms = {};  // Map<String, Socket[]>: room name and sockets in that room
    }

    joinRoom(socket, data, ack) {
        if (socket.room) {
            this._leaveRoom(socket);
        }

        const roomies = this.rooms[data.room];
        if (roomies) {
            if (roomies.length < MAX_ROOMIES) {
                roomies.push(socket);
            } else {
                ack({ message: 'Room full!' });
                return;
            }
        } else {
            this.rooms[data.room] = [ socket ];
        }

        socket.join(data.room);
        socket.room = data.room;
        console.log(`Joined room ${socket.room}`);
        console.log(`${Object.keys(this.rooms).length} rooms present`);
        ack(null, {
            message: 'Joined room!',
            room: socket.room,
            mySocketId: socket.id,
            roomies: roomies ? roomies.filter(s => s.id !== socket.id).map(s => s.id) : []  // could use to verify if all roomies have introduced themselves
        });
        socket.to(socket.room)
            .emit('join-room', {
                message: 'New peer!',
                socketId: socket.id,
                room: socket.room,
                content: data.content,
                mode: data.mode
            });
    }

    introduction(socket, data, ack) {
        socket.to(data.socketId)
            .emit('introduction', {
                socketId: socket.id,
                room: data.room,
                content: data.content,
                mode: data.mode
            });
        ack(null, {
            message: 'Introduction success!'
        });
    }

    editorUpdate(socket, data, ack) {
        socket.to(socket.room)
            .emit('editor-update', {
                content: data.content,
                socketId: socket.id
            });
        ack(null, { message: 'Editor update received!' });
    }

    disconnect(socket, data) {
        this.connections.splice(this.connections.indexOf(socket), 1);
        console.log(`Disconnected: ${this.connections.length} socket connected`);

        if (socket.room) {
            this._leaveRoom(socket);
        }
    }

    _leaveRoom(socket) {
        socket.to(socket.room)
            .emit('leave-room', {
                socketId: socket.id
            })
            .leave(socket.room);

        const roomies = this.rooms[socket.room];
        roomies.splice(roomies.indexOf(socket), 1);
        console.log(`Left room ${socket.room}`);

        if (roomies.length === 0) {
            this._removeRoom(socket.room);
        }
    }

    _removeRoom(room) {
        console.log(`Deleting room ${room}`);
        delete this.rooms[room];
        console.log(`${Object.keys(this.rooms).length} rooms present`);
    }
}

module.exports = State;
