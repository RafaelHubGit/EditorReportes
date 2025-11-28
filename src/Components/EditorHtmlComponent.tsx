// EditorHtmlComponent.tsx - Versión simplificada y corregida
import React, { useCallback, useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Handlebars from "handlebars";
import { debounce } from 'lodash';
import { EditorBaseComponent } from "./EditorBaseComponent";
import { useHandlebarsSetup } from "../hooks/useHandlebarsSetup";

type Props = {
  htmlCodeprop: string;
  setHtmlCodeProp: (html: string) => void;
  setHtmlProcesedProp: (html: string) => void;
  jsonStringProp: Record<string, any>;
}

export const EditorHtmlComponent = React.memo(({
  htmlCodeprop,
  setHtmlCodeProp,
  setHtmlProcesedProp,
  jsonStringProp
}: Props) => {
  const [error, setError] = useState("");

  useHandlebarsSetup();

  // Función para procesar el template
  const processTemplate = useCallback((html: string, jsonData: Record<string, any>) => {
    try {
      const template = Handlebars.compile(html);
      const processed = template(jsonData);
      return processed;
    } catch (error) {
      console.error("Error compilando template:", error);
      throw error;
    }
  }, []);

  // Debounce para cambios en el HTML
  const debouncedProcess = useCallback(
    debounce((html: string, jsonData: Record<string, any>) => {
      try {
        setHtmlCodeProp(html);

        if (!html.trim()) {
          setHtmlProcesedProp("");
          setError("");
          return;
        }

        const processed = processTemplate(html, jsonData);
        setHtmlProcesedProp(processed);
        setError("");

      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Error en el template";
        setError(errorMessage);
        setHtmlProcesedProp(html); // Fallback al HTML original
        Swal.fire({
          icon: 'error',
          title: 'Error en el template',
          text: errorMessage,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    }, 500),
    [processTemplate]
  );

  // Procesar cuando cambia el HTML
  const handleChange = useCallback((value: string) => {
    debouncedProcess(value, jsonStringProp);
  }, [debouncedProcess, jsonStringProp]);

  // Procesar cuando cambia el JSON
  useEffect(() => {
    console.log("JSON cambiado, reprocesando...", jsonStringProp);
    debouncedProcess(htmlCodeprop, jsonStringProp);
  }, [jsonStringProp]);

  return (
    <EditorBaseComponent
      label="HTML"
      value={htmlCodeprop}
      onChange={handleChange}
      language="html"
      error={error}
    />
  );
});