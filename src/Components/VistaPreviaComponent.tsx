import React, { useMemo } from "react";
import { useReporteStore } from "../store/useReportStore";
import Handlebars from "handlebars";


export const VistaPreviaComponent = () => {
  const htmlCode = useReporteStore((state) => state.html);        // HTML template
  const cssCode  = useReporteStore((state) => state.css);         // CSS
  const jsonData = useReporteStore((state) => state.jsonData);    // JSON string

  const finalHtml = useMemo(() => {
    try {
      const data = JSON.parse(jsonData || "{}");
      const template = Handlebars.compile(htmlCode);
      return template(data);
    } catch (err) {
      return `<p style='color:red;'>Invalid JSON provided</p>`;
    }
  }, [htmlCode, jsonData]);

  return (
    <iframe
      title="preview"
      style={{ width: "100%", height: "100%", border: "none" }}
      srcDoc={`<style>${cssCode}</style>${finalHtml}`}
    />
  );
};

export default VistaPreviaComponent;
