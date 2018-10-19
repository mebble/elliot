import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

import Editor from '../../Editor/Editor';
import Display from '../../Display/Display';

import './Main.css';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peers: []
        };
        this.socket = props.socket;
        this.room = props.room;
        this.initSocketListeners();

        this.myEditorChange = this.myEditorChange.bind(this);
    }

    initSocketListeners() {
        this.socket.on('roomie-join', (data) => {
            const newPeer = {
                socketId: data.socketId,
                initContent: 'New peer',
                mode: 'javascript'
            };
            this.setState({
                peers: [...this.state.peers, newPeer]
            });
        });
        this.socket.on('roomie-editor', (data) => {

        });
        this.socket.on('roomie-leave', (data) => {

        });
    }

    myEditorChange(newContent, changeObject) {
        // !! use the change object
        this.socket.emit('editor-update', {
            content: newContent
        }, (ack) => {
            console.log(ack);
        });
    }

    render() {
        const { peers } = this.state;
        return (
            <div className="Main">
                <SplitPane split="vertical" defaultSize="50%" >
                    <Editor initContent="// Your code goes here..." onChange={this.myEditorChange} />
                    {peers.length
                        ? peers.map(d => <Display key={d.socketid} {...d} />)
                        : <Display initContent="Nobody here..." />
                    }
                    {/* Only one peer display appears */}
                </SplitPane>
            </div>
        );
    }
}

export default Main;
