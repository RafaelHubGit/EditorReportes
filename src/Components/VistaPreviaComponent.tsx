import { useRef } from "react";
import {
  Typography,
} from "antd";

const { Text } = Typography;

type Props = {
  htmlProp: string;
}

export const VistaPreviaComponent = ({
  htmlProp
}: Props) => {

  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div
      style={{ width: "100%", height: "100%", border: "none" }}
    >
      <Text type="secondary" italic style={{ fontSize: '12px', display: 'block', marginBottom: 12 }}>
        * Esta es una aproximación visual. El formato final puede variar ligeramente en el PDF generado.
      </Text>
      <iframe
        ref={iframeRef}
        title="preview"
        srcDoc={htmlProp}
        style={{ 
          width: "100%", 
          height: "100%", 
          border: "none",
          paddingBottom: "98px"
        }}
      />
    </div>
  );
};

