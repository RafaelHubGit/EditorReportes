import React from "react";
import { RouteObject } from "react-router-dom";
import { EditorHtmlComponent } from "../Components/EditorHtmlComponent";
import { EditorCssComponent } from "../Components/EditorCssComponent";
import { EditorJsonComponent } from "../Components/EditorJsonComponent";
import { VistaPreviaComponent } from "../Components/VistaPreviaComponent";

// Definir las rutas principales de inicio
const routes: RouteObject[] = [
  {
    path: 'editorHtml',
    element: <EditorHtmlComponent />,
  },
  {
    path: 'editorCss',
    element: <EditorCssComponent />
  },
  {
    path: 'editorJson',
    element: <EditorJsonComponent />,
  },
  {
    path: 'vistaPrevia',
    element: <VistaPreviaComponent/>  
  }
];

export default routes;