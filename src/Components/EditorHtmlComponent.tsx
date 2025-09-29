// EditorHtmlComponent.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useReporteStore } from "../store/useReportStore";
import Handlebars from "handlebars";
import * as justHelpers from "just-handlebars-helpers";
import moment from "moment";
import { EditorBaseComponent } from "./EditorBaseComponent";


type Props = {
  htmlCodeprop: string;
  setHtmlCodeProp: ( html: string ) => void;

  jsonStringProp: string;
}

export const EditorHtmlComponent = React.memo(({ htmlCodeprop, setHtmlCodeProp, jsonStringProp }: Props) => {
  // const setHtml = useReporteStore((s) => s.setHtml);
  const setHtmlProcessed = useReporteStore((s) => s.setHtmlProcessed);
  // const htmlCode = useReporteStore((s) => s.html);
  // const jsonString = useReporteStore((s) => s.jsonData);
  // const docId = useReporteStore((s) => s.documentId) ?? "current";  

  const [error, setError] = useState("");

  // Register helpers once
  useEffect(() => {
    if (justHelpers.default && typeof justHelpers.default.registerHelpers === "function") {
      justHelpers.default.registerHelpers(Handlebars);
    }
    Handlebars.registerHelper("dateFormat", (date, format) => moment(date).format(format));
  }, []);

  // Optional: compare helper (kept from your original)
  // useEffect(() => {
  //   Handlebars.registerHelper("compare", function (a, operator, b, options) {
  //     switch (operator) {
  //       case ">":  return a >  b ? options.fn(this) : options.inverse(this);
  //       case "<":  return a <  b ? options.fn(this) : options.inverse(this);
  //       case ">=": return a >= b ? options.fn(this) : options.inverse(this);
  //       case "<=": return a <= b ? options.fn(this) : options.inverse(this);
  //       case "==": return a ==  b ? options.fn(this) : options.inverse(this);
  //       case "!=": return a !=  b ? options.fn(this) : options.inverse(this);
  //       case "===":return a === b ? options.fn(this) : options.inverse(this);
  //       case "!==":return a !== b ? options.fn(this) : options.inverse(this);
  //       default:
  //         setError(`Operador "${operator}" no soportado.`);
  //         return options.inverse(this);
  //     }
  //   });
  // }, []);
  useEffect(() => {
    Handlebars.registerHelper(
      "compare",
      function (
        this: any,
        a: any,
        operator: string,
        b: any,
        options: Handlebars.HelperOptions
      ) {
        switch (operator) {
          case ">":   return a >  b ? options.fn(this) : options.inverse(this);
          case "<":   return a <  b ? options.fn(this) : options.inverse(this);
          case ">=":  return a >= b ? options.fn(this) : options.inverse(this);
          case "<=":  return a <= b ? options.fn(this) : options.inverse(this);
          case "==":  return a ==  b ? options.fn(this) : options.inverse(this);
          case "!=":  return a !=  b ? options.fn(this) : options.inverse(this);
          case "===": return a === b ? options.fn(this) : options.inverse(this);
          case "!==": return a !== b ? options.fn(this) : options.inverse(this);
          default:
            setError(`Operador "${operator}" no soportado.`);
            return options.inverse(this);
        }
      }
    );
  }, []);


  const handleChange = useCallback((value: string) => {
    try {
      // Parse jsonData from store (string or object)
      const jsonData = typeof jsonStringProp === "string" ? JSON.parse(jsonStringProp) : jsonStringProp;
      if (!jsonData || typeof jsonData !== "object") {
        // still save the raw html so user doesn’t “lose” edits
        setHtmlCodeProp(value);
        setError("");
        return;
      }

      // Brace sanity check to avoid compiling half-written templates
      const openBraces = (value.match(/{{/g) || []).length;
      const closeBraces = (value.match(/}}/g) || []).length;
      if (openBraces !== closeBraces) {
        setHtmlCodeProp(value);     // save current text
        setError("");       // no hard error; just incomplete
        return;
      }

      const template = Handlebars.compile(value);
      const processed = template(jsonData);

      setHtmlProcessed(processed);
      setHtmlCodeProp(value);
      setError("");
    } catch (e: any) {
      setHtmlCodeProp(value);       // keep user input
      setError(e?.message ?? "Template error");
    }
  }, [jsonStringProp, setHtmlProcessed, setHtmlCodeProp]);

  return (
    <EditorBaseComponent
      label="HTML"
      value={htmlCodeprop}
      onChange={handleChange}
      // onChange={setHtmlCodeProp}
      language="html"
      error={error}
      path="file:///editor-html.html"
    />
  );
});
