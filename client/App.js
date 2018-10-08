import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

import './App.css';

import Editor from './Editor';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <SplitPane split="vertical" defaultSize="50%">
                    <Editor content="// Your code goes here..."/>
                    <Editor content="// Your friend's code shows up here..." readOnly="nocursor" />
                </SplitPane>
            </div>
        );
    }
}

export default App;
