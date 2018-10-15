import React, { Component } from 'react';
import CodeMirror from '@skidding/react-codemirror';

const Display = (props) => {
    const cmOptions = {
        mode: props.mode,
        readOnly: 'nocursor',
        lineNumbers: true
    };

    return (
        <div className="Display">
            <CodeMirror
                value={props.initContent}
                options={cmOptions}
            />
        </div>
    );
};

export default Display;
