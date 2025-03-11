import React, { useEffect } from "react";
import { useReporteStore } from "../store/useReportStore";


export const VistaPreviaComponent = () => {
    const htmlCode = useReporteStore( state => state.html );
    const cssCode = useReporteStore( state => state.css );
    const jsonData = useReporteStore( state => state.jsonData );

    useEffect(() => {
      console.log("HTML : ", htmlCode)
    }, [htmlCode])
    
  
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
      <div style={{ width: "50%", padding: "10px" }}>
        <h2>Vista Previa</h2>
        <iframe
          title="preview"
          style={{ width: "100%", height: "90%", border: "1px solid #ddd" }}
          srcDoc={`<style>${cssCode}</style>${processHtml(htmlCode, jsonData)}`}
        />
      </div>
    );
  };