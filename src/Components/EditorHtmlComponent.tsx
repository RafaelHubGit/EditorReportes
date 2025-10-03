// EditorHtmlComponent.tsx
import React, { useCallback, useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Handlebars from "handlebars";
import { debounce } from 'lodash';

// import registerHelpers from "just-handlebars-helpers";
import moment from "moment";
import { EditorBaseComponent } from "./EditorBaseComponent";
// import registerHelpers from "just-handlebars-helpers";
import { useHandlebarsSetup } from "../hooks/useHandlebarsSetup";


type Props = {
  htmlCodeprop: string;
  setHtmlCodeProp: ( html: string ) => void;

  setHtmlProcesedProp: ( html: string ) => void;

  jsonStringProp: string;
}

export const EditorHtmlComponent = React.memo(({ 
  htmlCodeprop, 
  setHtmlCodeProp,
  setHtmlProcesedProp,
  jsonStringProp 
}: Props) => {
  // const setHtml = useReporteStore((s) => s.setHtml);
  // const setHtmlProcessed = useReporteStore((s) => s.setHtmlProcessed);
  // const htmlCode = useReporteStore((s) => s.html);
  // const jsonString = useReporteStore((s) => s.jsonData);
  // const docId = useReporteStore((s) => s.documentId) ?? "current";  

  const [error, setError] = useState("");

  useHandlebarsSetup();

  
  useEffect(() => {
    // Reprocesar el HTML cuando el JSON cambie
    handleChange(htmlCodeprop);
  }, [jsonStringProp]);

  const handleChange = useCallback(
    debounce((value: string) => {
      try {
        // Siempre guardar el HTML original
        setHtmlCodeProp(value);
        
        let jsonData = {};
        
        // Intentar parsear JSON, si falla usar objeto vacío
        try {
          if (jsonStringProp && jsonStringProp.trim() !== "") {
            jsonData = typeof jsonStringProp === "string" 
              ? JSON.parse(jsonStringProp) 
              : jsonStringProp;
          }
        } catch (jsonError) {
          console.warn("JSON inválido, usando objeto vacío:", jsonError);
          jsonData = {};
          Swal.fire({
            icon: 'warning',
            title: 'Error en el template',
            text: `${jsonError}`,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
  
        // Asegurarnos de que jsonData es un objeto
        if (!jsonData || typeof jsonData !== 'object') {
          jsonData = {};
        }
  
        // Procesar el template con los datos disponibles
        try {
          const template = Handlebars.compile(value);
          const processed = template(jsonData);
          setHtmlProcesedProp(processed);
          setError("");
        } catch (templateError) {
          // Si hay error en el template, mostrar el HTML crudo como fallback
          console.warn("Error compilando template:", templateError);
          Swal.fire({
            icon: 'warning',
            title: 'Error en el template',
            text: `${templateError}`,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          setHtmlProcesedProp(value);
          const errorMessage = templateError instanceof Error 
            ? templateError.message 
            : "Template error";
          setError(errorMessage);
        }
        
      } catch (e: any) {
        console.log("Error general:", e);
        Swal.fire({
          icon: 'warning',
          title: 'Error en el template',
          text: 'Se mostró HTML sin procesar por error en la plantilla',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        setHtmlCodeProp(value);
        setError(e?.message ?? "Template error");
        // Fallback: mostrar HTML crudo
        setHtmlProcesedProp(value);

      }
    }, 500),
    [htmlCodeprop, jsonStringProp, setHtmlCodeProp, setHtmlProcesedProp]
  );

  return (
    <EditorBaseComponent
      label="HTML"
      value={htmlCodeprop}
      onChange={handleChange}
      // onChange={setHtmlCodeProp}
      language="html"
      error={error}
      // path="file:///editor-html.html"
    />
  );
});
