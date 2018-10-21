import React, { Component } from 'react';
import io from 'socket.io-client';

import Login from './Pages/Login/Login';
import Main from './Pages/Main/Main';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: null,
            editor: {
                content: '// Hey there!',
                mode: 'javascript'
            }
        };
        this.socket = io();

        this.setRoom = this.setRoom.bind(this);
        this.myEditorChange = this.myEditorChange.bind(this);
    }

    setRoom(room) {
        this.socket.emit('join-room', {
            room: room,
            ...this.state.editor
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

    myEditorChange(newContent, changeObject) {
        // !! use the change object
        this.setState(state => {
            return {
                editor: { ...state.editor, content: newContent }
            };
        }, () => {
            this.socket.emit('editor-update', {
                content: newContent
            }, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
            });
        });
    }

    render() {
        const { room, editor } = this.state;
        return (
            <div className="App">
                {room
                    ? <Main editor={editor} room={room} socket={this.socket} onNewRoom={this.setRoom} onEditorChange={this.myEditorChange} />
                    : <Login onRoom={this.setRoom} />
                }
            </div>
        );
    }
}

export default App;
