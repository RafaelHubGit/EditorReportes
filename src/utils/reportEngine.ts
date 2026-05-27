import Handlebars from "handlebars";

interface ReportParts {
  html: string;
  css: string;
  headerHtml?: string;
  headerCss?: string;
  footerHtml?: string;
  footerCss?: string;
  data: any;
}

export const generateFinalHtml = ({
  html,
  css,
  headerHtml,
  headerCss,
  footerHtml,
  footerCss,
  data
}: ReportParts): string => {
  
  const compile = (template: string = "") => {
    try {
      return Handlebars.compile(template)(data);
    } catch (e) {
      console.error("Error compilando parte del reporte:", e);
      return template; 
    }
  };

  // Procesamos cada pieza con los datos del JSON
  const processedBody = compile(html);
  const processedHeader = compile(headerHtml);
  const processedFooter = compile(footerHtml);

  // Retornamos el documento completo que el iframe puede leer directamente
  return `
    <html>
      <head>
        <style>
          ${css}
          #report-header { ${headerCss || ""} }
          #report-footer { ${footerCss || ""} }
          /* Estilos base para simular la hoja */
          body { background: #f0f0f0; margin: 0; display: flex; flex-direction: column; align-items: center; }
          .paper { background: white; width: 100%; box-sizing: border-box; }
        </style>
      </head>
      <body>
        <header id="report-header">${processedHeader}</header>
        <main class="paper">${processedBody}</main>
        <footer id="report-footer">${processedFooter}</footer>
      </body>
    </html>
  `;
};