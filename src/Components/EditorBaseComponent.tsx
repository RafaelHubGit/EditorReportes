import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  extensions: any[];
  error?: string;
}

export const EditorBaseComponent = ({ label, value, onChange, extensions, error }: Props) => {
  return (
    <div className="editor-premium">
      {/* <div className="editor-header">
        <h3>{label}</h3>
      </div> */}
      <div className="editor-wrapper">
        <CodeMirror
          value={value}
          extensions={extensions}
          onChange={onChange}
        //   theme="dark"
          basicSetup={{ lineNumbers: true }}
        />
      </div>
      {error && <div className="editor-error">{error}</div>}
    </div>
  );
};
