import { Tabs } from "antd";
import { EditorHtmlComponent } from "./EditorHtmlComponent";
import { EditorCssComponent } from "./EditorCssComponent";
import { EditorJsonComponent } from "./EditorJsonComponent";
import { EditorSectionComponent } from "./EditorSectionComponent";
import PrintSettingsPanel from "./PageConfiguration/PrintSettingsPanel";
import type { IDocument } from "../interfaces/IGeneric";
import { VistaPreviaComponent } from "./VistaPreviaComponent";
import { generateFinalHtml } from "../utils/reportEngine";

interface Props {
  documentState: IDocument;
  updateDocumentState: (updates: Partial<IDocument>) => void;
  mode: 'full' | 'split';
  height?: string;
}

export const EditorTabs = ({ documentState, updateDocumentState, mode, height = 'calc(100vh - 210px)' }: Props) => {
  const commonTabs = [
    {
      label: "HTML",
      key: "html",
      children: (
        <div style={{ height }}>
          <EditorHtmlComponent
            htmlCodeprop={documentState.html}
            setHtmlCodeProp={(html) => updateDocumentState({ html })}
            jsonStringProp={documentState.sampleData}
          />
        </div>
      )
    },
    {
      label: "CSS",
      key: "css",
      children: (
        <div style={{ height }}>
          <EditorCssComponent
            cssProp={documentState.css}
            setCssProp={(css) => updateDocumentState({ css })}
          />
        </div>
      )
    },
    {
      label: "JSON",
      key: "json",
      children: (
        <div style={{ height }}>
          <EditorJsonComponent
            jsonProp={JSON.stringify(documentState.sampleData)}
            setJsonProp={(json) => updateDocumentState({ sampleData: JSON.parse(json) })}
          />
        </div>
      )
    },
    {
      label: "Configuración de página",
      key: "config",
      children: (
        <div style={{ height, overflow: 'auto' }}>
          <PrintSettingsPanel
            config={documentState.printConfig}
            setConfig={(newConfig) => updateDocumentState({ printConfig: newConfig })}
          />
        </div>
      )
    },
    {
      label: "Encabezado",
      key: "header",
      children: (
        <EditorSectionComponent
          html={documentState.htmlHeader || ""}
          css={documentState.cssHeader || ""}
          onChangeHtml={(html) => updateDocumentState({ htmlHeader: html })}
          onChangeCss={(css) => updateDocumentState({ cssHeader: css })}
          jsonStringProp={documentState.sampleData}
        />
      )
    },
    {
      label: "Pie de página",
      key: "footer",
      children: (
        <EditorSectionComponent
          html={documentState.htmlFooter || ""}
          css={documentState.cssFooter || ""}
          onChangeHtml={(html) => updateDocumentState({ htmlFooter: html })}
          onChangeCss={(css) => updateDocumentState({ cssFooter: css })}
          jsonStringProp={documentState.sampleData}
        />
      )
    }
  ];

  if (mode === 'split') {
    return <Tabs defaultActiveKey="html" items={commonTabs} />;
  }

  return (
    <Tabs
      defaultActiveKey="html"
      items={[
        ...commonTabs,
        {
          label: "Vista Previa",
          key: "preview",
          children: (
            <div style={{ height: 'calc(100vh - 150px)' }}>
              <VistaPreviaComponent
                htmlProp={generateFinalHtml({
                  html: documentState.html || "",
                  css: documentState.css || "",
                  headerHtml: documentState.htmlHeader || "",
                  headerCss: documentState.cssHeader || "",
                  footerHtml: documentState.htmlFooter || "",
                  footerCss: documentState.cssFooter || "",
                  data: documentState.sampleData
                })}
              />
            </div>
          )
        }
      ]}
    />
  );
};