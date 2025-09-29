

import { linter } from '@codemirror/lint';
import { useReporteStore } from '../store/useReportStore';
import { EditorBaseComponent } from './EditorBaseComponent';
import { getExtensions } from '../utils/codeMirrorExtensions';

export const EditorJsonComponent = () => {
  const { jsonData, setJsonData } = useReporteStore();

  return (
    <EditorBaseComponent
      label="Editor JSON"
      value={jsonData}
      onChange={setJsonData}
      language='json'
      // jsonSchema={schema}
      // extensions={ getExtensions.json() }
    />
  );
};
