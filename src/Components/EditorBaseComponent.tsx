import { memo, useEffect } from 'react';
import MonacoCodeEditor from './MonacoEditor/MonacoCodeEditor';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "json";
  jsonSchema?: object;
  error?: string;
  path?: string;
}

export const EditorBaseComponent = memo(({
  label,
  value,
  onChange,
  language,
  jsonSchema,
  error,
  path, 
}: Props) => {
  // return (
  //   <div className="editor-premium">
  //     {/* <div className="editor-header">
  //       <h3>{label}</h3>
  //     </div> */}
  //     {/* <div className="editor-wrapper"> */}
  //       <CodeMirror
  //         value={value}
  //         extensions={extensions}
  //         onChange={onChange}
  //       //   theme="dark"
  //         basicSetup={{ lineNumbers: true }}
  //       />
  //     {/* </div> */}
  //     {error && <div className="editor-error">{error}</div>}
  //   </div>
  // );

  return (
    <div className="editor-host" style={{ height: "100%", minHeight: 0 }}>
        <MonacoCodeEditor
          value={value}
          onChange={onChange}
          language={language}
          // schema={language === "json" ? jsonSchema : undefined}
          path={path}
        />
        {error && <div className="editor-error">{error}</div>}
    </div>
  )
});
