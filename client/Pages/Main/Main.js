import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

import Editor from '../../Editor/Editor';

import './Main.css';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peers: []
        };
        this.socket = props.socket;

        this.initSocketListeners = this.initSocketListeners.bind(this);

        this.initSocketListeners();
    }

    initSocketListeners() {
        this.socket.on('join-room', (peer) => {
            if (peer.room != this.props.room) throw new Error('An outsider is here!');

            this.socket.emit('introduction', {
                to: peer.socketId,
                room: this.props.room,
                ...this.props.editor
            }, (err, res) => {
                if (err) return console.error(err);

                this.setState(state => {
                    return {
                        peers: [...state.peers, {
                            socketId: peer.socketId,
                            content: peer.content,
                            mode: peer.mode
                        }]
                    };
                });
            });
        });
        this.socket.on('introduction', (peer) => {
            if (peer.room != this.props.room) throw new Error('I joined the wrong room!');

            this.setState(state => {
                return {
                    peers: [...state.peers, {
                        socketId: peer.socketId,
                        content: peer.content,
                        mode: peer.mode
                    }]
                };
            });
        });
        this.socket.on('editor-update', (data) => {
            this.setState(state => {
                const updatedPeers = state.peers.map(p => {
                    return p.socketId === data.socketId ? { ...p, content: data.content } : p;
                });
                return {
                    peers: updatedPeers
                };
            });
        });
        this.socket.on('leave-room', (data) => {
            this.setState(state => {
                const updatedPeers = state.peers.filter(p => p.socketId !== data.socketId);
                return {
                    peers: updatedPeers
                };
            });
        });
    }

    render() {
        const { peers } = this.state;
        const { editor, onEditorChange } = this.props;
        return (
            <div className="Main">
                <SplitPane split="vertical" defaultSize="50%" >
                    <Editor {...editor} onChange={onEditorChange} />
                    {peers.length
                        ? peers.map(p => <Editor {...p} key={p.socketId} readOnly="nocursor" />)
                        : <Editor content="Nobody here..." readOnly="nocursor" />
                    }
                    {/* Bug - Only one peer display appears */}
                </SplitPane>
            </div>
        );
    }
}

export default Main;
