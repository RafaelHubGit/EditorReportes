import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { html } from "@codemirror/lang-html";
import { useReporteStore } from '../store/useReportStore';
import Handlebars from 'handlebars';
import * as justHelpers from "just-handlebars-helpers";
import moment from 'moment';



export const EditorHtmlComponent = () => {
    const setHtml  = useReporteStore( state => state.setHtml);
    const setHtmlProcessed  = useReporteStore( state => state.setHtmlProcessed);
    const htmlCode  = useReporteStore( state => state.html);
    const jsonString = useReporteStore((state) => state.jsonData); // Obtener los datos del store

    const [error, setError] = useState("");

    useEffect(() => {
      for (const [name, helper] of Object.entries(justHelpers)) {
        if (typeof helper === 'function') {
          Handlebars.registerHelper(name, helper);
        }
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
    
        console.log("HTML Procesado:", htmlProcesado);
        
        setHtmlProcessed(htmlProcesado);
        setHtml(value);
        setError(""); // Limpiar error si todo está bien
      } catch (error) {
        console.error("Error al procesar la plantilla:", error);
        setError(error.message);
      }
    };
    

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
          return options.inverse(this);
      }
    });
    
    

    return (
      <div>
        <h2>Editor HTML</h2>
        <CodeMirror 
          value={htmlCode} 
          extensions={[html()]} 
          // onChange={setHtml}
          onChange={handleChange} 
          theme="dark" 
          basicSetup={{ lineNumbers: true }} 
        />
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    );
  };