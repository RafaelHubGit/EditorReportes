import React, { useEffect } from "react";
import { useReporteStore } from "../store/useReportStore";

export const VistaPreviaComponent = () => {
  const htmlCode = useReporteStore((state) => state.html);
  const htmlProcessed = useReporteStore((state) => state.htmlProcessed);
  const cssCode = useReporteStore((state) => state.css);
  const jsonData = useReporteStore((state) => state.jsonData);

  useEffect(() => {
    console.log("HTML : ", htmlProcessed);
  }, [htmlProcessed]);

  const processHtml = (html: string, json: string) => {
    try {
      const data = JSON.parse(json);
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

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        margin: "10px 0",
      }}
    >
      {/* <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#333",
          marginBottom: "16px",
          borderBottom: "2px solid #eee",
          paddingBottom: "8px",
        }}
      >
        Vista Previa
      </h2> */}
      <iframe
        title="preview"
        style={{
          width: "100%",
          height: "600px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
        srcDoc={`<style>${cssCode}</style>${processHtml(htmlProcessed, jsonData)}`}
      />
    </div>
  );
};