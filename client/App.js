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
        this.socket = io();

        this.setRoom = this.setRoom.bind(this);
    }

    setRoom(roomName) {
        this.setState({
            room: roomName
        });
    }

    render() {
        const { room } = this.state;
        return (
            <div className="App">
                {room
                    ? <Main room={room} socket={this.socket} onNewRoom={this.setRoom} />
                    : <Login onRoom={this.setRoom} />
                }
            </div>
        );
    }
}

export default App;
