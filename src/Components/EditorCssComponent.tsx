
import React, { useState } from 'react'
import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { useReporteStore } from '../store/useReportStore';



export const EditorCssComponent = () => {
    const { css: cssCode, setCss } = useReporteStore();
    return (
      <div>
        <h2>Editor CSS</h2>
        <CodeMirror value={cssCode} extensions={[css()]} onChange={setCss} theme="dark" basicSetup={{ lineNumbers: true }} />
      </div>
    );
  };