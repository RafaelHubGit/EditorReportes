import React, { useEffect, useState } from 'react'
import { useReporteStore } from '../store/useReportStore';
import Handlebars from 'handlebars';
import * as justHelpers from "just-handlebars-helpers";
import moment from 'moment';
import { EditorBaseComponent } from './EditorBaseComponent';
import { getExtensions } from '../utils/codeMirrorExtensions';



export const EditorHtmlComponent = () => {
    const setHtml  = useReporteStore( state => state.setHtml);
    const setHtmlProcessed  = useReporteStore( state => state.setHtmlProcessed);
    const htmlCode  = useReporteStore( state => state.html);
    const jsonString = useReporteStore((state) => state.jsonData); // Obtener los datos del store

    const [error, setError] = useState("");

    useEffect(() => {

      // Registrar todos los helpers disponibles en just-handlebars-helpers
      if (justHelpers.default && typeof justHelpers.default.registerHelpers === "function") {
        justHelpers.default.registerHelpers(Handlebars);
        console.log("✔ Helpers registrados correctamente en Handlebars");
      } else {
        console.error("⚠ No se pudo registrar los helpers, la librería no está exportando correctamente.");
      }  

      // Registrar manualmente el helper dateFormat
      Handlebars.registerHelper('dateFormat', function(date, format) {
        return moment(date).format(format);
      });

    }, []);

    useEffect(() => {
      Handlebars.registerHelper("compare", function (a, operator, b, options) {
        switch (operator) {
          case ">":
            return a > b ? options.fn(this) : options.inverse(this);
          case "<":
            return a < b ? options.fn(this) : options.inverse(this);
          case ">=":
            return a >= b ? options.fn(this) : options.inverse(this);
          case "<=":
            return a <= b ? options.fn(this) : options.inverse(this);
          case "==":
            return a == b ? options.fn(this) : options.inverse(this);
          case "!=":
            return a != b ? options.fn(this) : options.inverse(this);
          case "===":
            return a === b ? options.fn(this) : options.inverse(this);
          case "!==":
            return a !== b ? options.fn(this) : options.inverse(this);
          default:
            console.error(`Operador "${operator}" no soportado.`);
            setError(`Operador "${operator}" no soportado.`);
            return options.inverse(this);
        }
      });
    }, []);

    // Función para procesar la plantilla cuando cambia el código
    const handleChange = (value: string) => {
      try {
        const jsonData = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
    
        if (!jsonData || typeof jsonData !== "object") {
          console.warn("jsonData está vacío o no es un objeto válido.");
          return;
        }
    
        // Validar si hay '{{' sin cerrar correctamente
        const openBraces = (value.match(/{{/g) || []).length;
        const closeBraces = (value.match(/}}/g) || []).length;
    
        if (openBraces !== closeBraces) {
          console.warn("Plantilla incompleta, esperando...");
          return;
        }
    
        // Compilar la plantilla Handlebars
        const template = Handlebars.compile(value);
        const htmlProcesado = template(jsonData);
        
        setHtmlProcessed(htmlProcesado);
        setHtml(value);
        setError(""); // Limpiar error si todo está bien
      } catch (error) {
        console.error("Error al procesar la plantilla:", error);
        setError(error.message);
      }
    };

    return (
      <EditorBaseComponent
        label="Editor HTML"
        value={htmlCode}
        onChange={handleChange}
        extensions={getExtensions.html()}
        error={error}
      />
    );

    // return (
    //   <div className="editor-container">
    //     <h2>Editor HTML</h2>
    //     <CodeMirror 
    //       value={htmlCode} 
    //       extensions={[html()]} 
    //       // onChange={setHtml}
    //       onChange={handleChange} 
    //       theme="dark" 
    //       basicSetup={{ lineNumbers: true }} 
    //     />
    //     <div>
    //       {error && <p className="error-message">{error}</p>}
    //     </div>
    //   </div>
    // );
  };