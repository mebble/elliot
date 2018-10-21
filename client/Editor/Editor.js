import React, { Component } from 'react';
import CodeMirror from '@skidding/react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import './Editor.css';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'javascript'
        };
    }

    render() {
        const cmOptions = {
            mode: this.state.mode,
            lineNumbers: true
        };

        return (
            <div className="Editor">
                <CodeMirror
                    value={this.props.content}
                    options={cmOptions}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

export default Editor;
