import React, { useState } from 'react'
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useReporteStore } from '../store/useReportStore';

export const EditorJsonComponent = () => {
    const { jsonData, setJsonData } = useReporteStore();
    return (
      <div>
        <h2>Editor JSON</h2>
        <CodeMirror value={jsonData} extensions={[javascript()]} onChange={setJsonData} theme="dark" basicSetup={{ lineNumbers: true }} />
      </div>
    );
  };