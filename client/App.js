import React, { Component } from 'react';
import io from 'socket.io-client';

import Login from './Pages/Login/Login';
import Main from './Pages/Main/Main';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: null
        };
        this.init = {
            content: '// Hey there!',
            mode: 'javascript'
        };
        this.socket = io();

        this.setRoom = this.setRoom.bind(this);
    }

    setRoom(room) {
        this.socket.emit('join-room', {
            room: room,
            ...this.init
        }, (err, res) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.log(res);
            this.setState({
                room: res.room
            });
        });
    }

    render() {
        const { room } = this.state;
        return (
            <div className="App">
                {room
                    ? <Main init={this.init} room={room} socket={this.socket} onNewRoom={this.setRoom} />
                    : <Login onRoom={this.setRoom} />
                }
            </div>
        );
    }
}

export default App;
