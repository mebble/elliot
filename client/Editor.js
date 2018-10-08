import React, { Component } from 'react';
import CodeMirror from '@skidding/react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.content,
            mode: 'javascript'
        }
    }

    render() {
        const { content } = this.state;
        const cmOptions = {
            mode: this.state.mode,
            readOnly: this.props.readOnly
        };

        return (
            <div className="Editor">
                <CodeMirror
                    value={content}
                    options={cmOptions}
                    height="100%"
                />
            </div>
        );
    }
}

export default Editor;
