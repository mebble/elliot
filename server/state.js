const MAX_ROOMIES = 2;

class State {
    constructor() {
        this.connections = [];  // Socket[]: all connections
        this.rooms = {};  // Map<String, Socket[]>: roomname and sockets in that room
    }

    joinRoom(socket, data, ack) {
        if (socket.roomName) {
            this._leaveRoom(socket);
        }

        const roomies = this.rooms[data.roomName];
        if (roomies) {
            if (roomies.length < MAX_ROOMIES) {
                roomies.push(socket);
            } else {
                ack({ message: 'Room full!' });
                return;
            }
        } else {
            this.rooms[data.roomName] = [ socket ];
        }

        socket.join(data.roomName);
        socket.roomName = data.roomName;
        console.log(`Joined room ${socket.roomName}`);
        console.log(`${Object.keys(this.rooms).length} rooms present`);
        ack(null, {
            message: 'Joined room!',
            roomName: data.roomName,
            mySocketId: socket.id,
            roomies: roomies ? roomies.filter(s => s.id !== socket.id).map(s => s.id) : []  // could use to verify if all roomies have introduced themselves
        });
        socket.to(socket.roomName)
            .emit('roomie-join', {
                message: 'New roomie!',
                socketId: socket.id,
                roomName: data.roomName,
                content: data.content,
                mode: data.mode
            });
    }

    introduction(socket, data, ack) {
        socket.to(data.socketId)
            .emit('roomie-introduce', {
                socketId: socket.id,
                roomName: data.roomName,
                content: data.content,
                mode: data.mode
            });
        ack(null, {
            message: 'Introduction success!'
        });
    }

    editorUpdate(socket, data, ack) {
        socket.to(socket.roomName)
            .emit('roomie-editor', {
                content: data.content,
                socketId: socket.id
            });
        ack(null, { message: 'Editor update received!' });
    }

    disconnect(socket, data) {
        this.connections.splice(this.connections.indexOf(socket), 1);
        console.log(`Disconnected: ${this.connections.length} socket connected`);

        if (socket.roomName) {
            this._leaveRoom(socket);
        }
    }

    _leaveRoom(socket) {
        socket.to(socket.roomName)
            .emit('roomie-leave', {
                socketId: socket.id
            })
            .leave(socket.roomName);

        const roomies = this.rooms[socket.roomName];
        roomies.splice(roomies.indexOf(socket), 1);
        console.log(`Left room ${socket.roomName}`);

        if (roomies.length === 0) {
            this._removeRoom(socket.roomName);
        }
    }

    _removeRoom(roomName) {
        console.log(`Deleting room ${roomName}`);
        delete this.rooms[roomName];
        console.log(`${Object.keys(this.rooms).length} rooms present`);
    }
}

module.exports = State;
