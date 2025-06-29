import React, { useEffect, useState } from "react";
import { useReporteStore } from "../store/useReportStore";

export const VistaPreviaComponent = () => {
  const htmlCode = useReporteStore((state) => state.html);
  const htmlProcessed = useReporteStore((state) => state.htmlProcessed);
  const cssCode = useReporteStore((state) => state.css);
  const jsonData = useReporteStore((state) => state.jsonData);

  const [iframeKey, setIframeKey] = useState(0); // Para forzar re-render


  useEffect(() => {
    console.log("HTML PROCESADO : ", jsonData);
  }, [htmlProcessed, jsonData]);

  const processHtml = (html: string, json: string) => {
    try {
      const data = JSON.parse(json);
      console.log("DATA : ", data);
      let processedHtml = html;
      Object.keys(data).forEach((key) => {
        const regex = new RegExp(`\\$\\{${key}}`, "g");
        processedHtml = processedHtml.replace(regex, data[key]);
      });
      return processedHtml;
    } catch (error) {
      return "<p style='color: red;'>Error en el JSON</p>";
    }
  };

  // Actualiza cuando cambien las dependencias
  useEffect(() => {
    setIframeKey(prev => prev + 1); // Forzar re-render del iframe
  }, [htmlCode, htmlProcessed, cssCode, jsonData]);

  return (
    <iframe
      key={iframeKey}
      title="preview"
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ccc",
      }}
      srcDoc={`<style>${cssCode}</style>${processHtml(htmlProcessed, jsonData)}`}
    />
  );
};