import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

import Editor from '../../Editor/Editor';
import Display from '../../Display/Display';

import './Main.css';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            me: { ...props.init },
            peers: []
        };
        this.socket = props.socket;
        this.room = props.room;
        this.initSocketListeners();

        this.myEditorChange = this.myEditorChange.bind(this);
    }

    initSocketListeners() {
        this.socket.on('roomie-join', (peer) => {
            if (peer.roomName != this.room) throw new Error('An outsider is here!');

            this.socket.emit('introduction', {
                socketId: peer.socketId,
                roomName: this.room,
                ...this.state.me
            }, (err, res) => {
                if (err) return console.error(err);

                this.setState({
                    peers: [...this.state.peers, {
                        socketId: peer.socketId,
                        content: peer.content,
                        mode: peer.mode
                    }]
                });
            });
        });
        this.socket.on('roomie-introduce', (peer) => {
            if (peer.roomName != this.room) throw new Error('I joined the wrong room!');
            this.setState({
                peers: [...this.state.peers, {
                    socketId: peer.socketId,
                    content: peer.content,
                    mode: peer.mode

                }]
            });
        });
        this.socket.on('roomie-editor', (data) => {
            const updatedPeers = this.state.peers.map(p => {
                return p.socketId === data.socketId ? { ...p, content: data.content } : p;
            })
            this.setState({
                peers: updatedPeers
            });
        });
        this.socket.on('roomie-leave', (data) => {

        });
    }

    myEditorChange(newContent, changeObject) {
        // !! use the change object
        this.setState(state => {
            return {
                me: { ...state.me, content: newContent }
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
        const { me, peers } = this.state;
        return (
            <div className="Main">
                <SplitPane split="vertical" defaultSize="50%" >
                    <Editor {...me} onChange={this.myEditorChange} />
                    {peers.length
                        ? peers.map(p => <Display key={p.socketId} {...p} />)
                        : <Display initContent="Nobody here..." />
                    }
                    {/* Bug - Only one peer display appears */}
                </SplitPane>
            </div>
        );
    }
}

export default Main;
