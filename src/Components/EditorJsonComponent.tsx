import { useReporteStore } from '../store/useReportStore';
import { EditorBaseComponent } from './EditorBaseComponent';


type Props = {
  jsonProp: string;
  setJsonProp: ( json: string ) => void;
}


export const EditorJsonComponent = ({ jsonProp, setJsonProp }: Props) => {
  // const { jsonData, setJsonData } = useReporteStore();

  return (
    <EditorBaseComponent
      label="Editor JSON"
      value={jsonProp}
      onChange={setJsonProp}
      language='json'
      // jsonSchema={schema}
      // extensions={ getExtensions.json() }
    />
  );
};
