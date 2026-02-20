// componente que se utiliza para el pie de pagina y encabezado


import { Tabs } from "antd";
import { EditorHtmlComponent } from "./EditorHtmlComponent";
import { EditorCssComponent } from "./EditorCssComponent";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";

type Props = {
  html: string;
  css: string;
  onChangeHtml: (val: string) => void;
  onChangeCss: (val: string) => void;

  setHtmlProcessed: (val: string) => void; 
  sampleData: Record<string, any>;
};

export const EditorSectionComponent = ({ 
  html, 
  css, 
  onChangeHtml, 
  onChangeCss, 
  setHtmlProcessed,
  sampleData 
}: Props) => {

  // Función para procesar Handlebars
  const debouncedProcess = useCallback(
    debounce((rawHtml: string, data: Record<string, any>) => {
      try {
        if (!rawHtml.trim()) {
          setHtmlProcessed("");
          return;
        }
        const template = Handlebars.compile(rawHtml);
        setHtmlProcessed(template(data));
      } catch (error) {
        // En caso de error, enviamos el HTML crudo para no romper la vista
        setHtmlProcessed(rawHtml);
      }
    }, 500),
    []
  );

  // Procesar cuando cambie el HTML o los datos de ejemplo
  useEffect(() => {
    debouncedProcess(html, sampleData);
  }, [html, sampleData, debouncedProcess]);

  return (
    <Tabs
      type="card"
      items={[
        {
          label: "HTML",
          key: "html",
          children: (
            <div style={{ height: 'calc(100vh - 300px)' }}>
              <EditorHtmlComponent
                htmlCodeprop={html}
                setHtmlCodeProp={onChangeHtml}

                setHtmlProcesedProp={ setHtmlProcessed } 
                jsonStringProp={sampleData}
              />
            </div>
          ),
        },
        {
          label: "CSS",
          key: "css",
          children: (
            <div style={{ height: 'calc(100vh - 300px)' }}>
              <EditorCssComponent
                cssProp={css}
                setCssProp={onChangeCss}
              />
            </div>
          ),
        },
      ]}
    />
  );
};