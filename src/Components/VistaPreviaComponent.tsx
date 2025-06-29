import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReporteStore } from "../store/useReportStore";
import Handlebars from "handlebars";

export const VistaPreviaComponent = () => {
  const htmlCode = useReporteStore((s) => s.html);
  const cssCode  = useReporteStore((s) => s.css);
  const jsonData = useReporteStore((s) => s.jsonData);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollYRef = useRef(0);
  const [srcDoc, setSrcDoc] = useState("");

  const compiledHtml = useMemo(() => {
    try {
      const data = JSON.parse(jsonData || "{}");
      return Handlebars.compile(htmlCode)(data);
    } catch {
      return `<p style='color:red;'>Invalid JSON</p>`;
    }
  }, [htmlCode, jsonData]);

  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (win) scrollYRef.current = win.scrollY;

    const timeout = setTimeout(() => {
      const full = `<style>${cssCode} body{white-space:pre-wrap;}</style>${compiledHtml}`;
      setSrcDoc(full);
    }, 500);

    return () => clearTimeout(timeout);
  }, [compiledHtml, cssCode]);

  const handleLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.scrollTo(0, scrollYRef.current);
  };

  return (
    <iframe
      ref={iframeRef}
      title="preview"
      srcDoc={srcDoc}
      onLoad={handleLoad}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

