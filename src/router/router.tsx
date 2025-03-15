import React from "react";
import { RouteObject } from "react-router-dom";
import LayoutApp from "../layouts/LayoutApp";
import { EditorHtmlComponent } from "../Components/EditorHtmlComponent";
import { EditorCssComponent } from "../Components/EditorCssComponent";
import { EditorJsonComponent } from "../Components/EditorJsonComponent";
import { VistaPreviaComponent } from "../Components/VistaPreviaComponent";
import HomeComponent from "../Components/HomeComponent";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeComponent />, // Ruta sin LayoutApp
  },
  {
    path: "/app", // Ruta base para las rutas con LayoutApp
    element: <LayoutApp />, // LayoutApp se aplica a todas las rutas hijas
    children: [
      {
        path: "editorHtml", // Ruta relativa: /app/editorHtml
        element: <EditorHtmlComponent />,
      },
      {
        path: "editorCss", // Ruta relativa: /app/editorCss
        element: <EditorCssComponent />,
      },
      {
        path: "editorJson", // Ruta relativa: /app/editorJson
        element: <EditorJsonComponent />,
      },
      {
        path: "vistaPrevia", // Ruta relativa: /app/vistaPrevia
        element: <VistaPreviaComponent />,
      },
    ],
  },
];

export default routes;