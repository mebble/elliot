import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import io from 'socket.io-client';

import './App.css';

import Editor from './Editor/Editor';
import Display from './Display/Display';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displays: []
        };
        this.socket = io();
        this.initSocketListeners();

        this.myEditorChange = this.myEditorChange.bind(this);
    }

    initSocketListeners() {
        this.socket.on('roomie-join', (data) => {

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
        return (
            <div className="App">
                <SplitPane split="vertical" defaultSize="50%">
                    <Editor initContent="// Your code goes here..." onChange={this.myEditorChange} />
                    <Display initContent="// Your friend's code shows up here..." mode="javascript" />
                </SplitPane>
            </div>
        );
    }
}

export default App;
