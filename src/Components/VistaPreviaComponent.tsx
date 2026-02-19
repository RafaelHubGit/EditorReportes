import React, { useEffect, useMemo, useRef, useState } from "react";
import type { IPrintConfig } from "../interfaces/IPrintSettings";
import {
  Typography,
} from "antd";

const { Title, Text } = Typography;

type Props = {
  htmlProp: string;
  cssProp: string;
  printConfig: IPrintConfig
}

export const VistaPreviaComponent = ({ htmlProp, cssProp, printConfig }: Props) => {

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollYRef = useRef(0);
  const [srcDoc, setSrcDoc] = useState("");

  const { layout, margins } = printConfig;

  // useEffect(() => {
  //   const win = iframeRef.current?.contentWindow;
  //   if (win) scrollYRef.current = win.scrollY;

  //   // Reducir el timeout para mayor responsividad
  //   const timeout = setTimeout(() => {
  //     const full = `<style>${cssProp}</style>${htmlProp}`;
  //     setSrcDoc(full);
  //   }, 300); // Reducido de 500ms a 300ms

  //   return () => clearTimeout(timeout);
  // }, [htmlProp, cssProp]);

  const handleLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.scrollTo(0, scrollYRef.current);
  };

  useEffect(() => {

    // Si no hay configuración, no hacemos nada para evitar el error
    if (!printConfig || !printConfig.layout || !printConfig.margins) return;

    const timeout = setTimeout(() => {
      // Determinamos dimensiones base según el formato o valores manuales
      const width = layout.format === 'custom' ? `${layout.width}mm` : (layout.orientation === 'portrait' ? '210mm' : '297mm');
      const height = layout.format === 'custom' ? `${layout.height}mm` : (layout.orientation === 'portrait' ? '297mm' : '210mm');

      const full = `
        <html>
          <head>
            <style>
              /* Estilos base del simulador */
              body {
                background-color: #f0f0f0; /* Fondo gris para resaltar la hoja */
                margin: 0;
                display: flex;
                justify-content: center;
                padding: 20px;
                font-family: sans-serif;
              }
              
              /* La "Hoja Virtual" */
              .paper-sheet {
                background: white;
                width: ${width};
                min-height: ${height};
                padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                box-sizing: border-box;
                position: relative;
              }

              /* Inyectamos el CSS del usuario */
              ${cssProp}

              /* Forzamos que el contenido del usuario respete el modo impresión */
              @media screen {
                .paper-sheet { overflow: hidden; }
              }
            </style>
          </head>
          <body>
            <div class="paper-sheet">
              ${htmlProp}
            </div>
          </body>
        </html>
      `;
      setSrcDoc(full);
    }, 300);

    return () => clearTimeout(timeout);
  }, [htmlProp, cssProp, printConfig]); // Se actualiza si cambian los márgenes o el formato

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
        srcDoc={srcDoc}
        onLoad={handleLoad}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

