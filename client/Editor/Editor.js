import React from 'react';
import CodeMirror from '@skidding/react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import './Editor.css';

const Editor = props => {
    const cmOptions = {
        mode: props.mode,
        lineNumbers: true
    };

    return (
        <div className="Editor">
            <CodeMirror
                value={props.content}
                options={cmOptions}
                onChange={props.onChange}
            />
        </div>
    );
};

export default Editor;
