

import { useReporteStore } from '../store/useReportStore';
import { EditorBaseComponent } from './EditorBaseComponent';
import { getExtensions } from '../utils/codeMirrorExtensions';

export const EditorCssComponent = () => {
  const { css: cssCode, setCss } = useReporteStore();

  return (
    <EditorBaseComponent
      label="Editor CSS"
      value={cssCode}
      onChange={setCss}
      extensions={ getExtensions.css() }
    />
  );
};
