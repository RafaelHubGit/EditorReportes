import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { html } from "@codemirror/lang-html";
import { useReporteStore } from '../store/useReportStore';



export const EditorHtmlComponent = () => {
    const setHtml  = useReporteStore( state => state.setHtml);
    const htmlCode  = useReporteStore( state => state.html);
    return (
      <div>
        <h2>Editor HTML</h2>
        <CodeMirror 
          value={htmlCode} 
          extensions={[html()]} 
          onChange={setHtml} 
          theme="dark" 
          basicSetup={{ lineNumbers: true }} 
        />
      </div>
    );
  };