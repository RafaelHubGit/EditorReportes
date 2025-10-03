import { Navigate, type RouteObject } from "react-router-dom";
import { LoginComponent } from "../auth/LoginComponent";
import { EditorCssComponent } from "../Components/EditorCssComponent";
import { EditorHtmlComponent } from "../Components/EditorHtmlComponent";
import { EditorJsonComponent } from "../Components/EditorJsonComponent";
import HomeComponent from "../Components/HomeComponent";
import { VistaPreviaComponent } from "../Components/VistaPreviaComponent";
import LayoutApp from "../layouts/LayoutApp";
import { RequireAuth } from "../auth/RequireAuth";
import { DocumentPage } from "../Components/Documents/DocumentPage";
import { EditorStudioComponent } from "../Components/EditorStudioComponent";


const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/app" replace />,
    // element: <HomeComponent />,            // public
  },
  {
    path: "/login",
    element: <LoginComponent />,           // public
  },
  {
    path: "/app",                          // everything after /app needs auth
    element: (
      <RequireAuth>
        <LayoutApp />
      </RequireAuth>
    ),
    children: [
      { path: "editor", element: <EditorStudioComponent /> },
      { path: "editor/editorCss",  element: <EditorCssComponent /> },
      { path: "editor/editorJson", element: <EditorJsonComponent /> },
      { path: "editor/vistaPrevia", element: <VistaPreviaComponent /> },
      { path: "documents", element: <DocumentPage /> },
      // { path: "configuracion", element: <div>Configuración</div> },
    ],
  },
  /* 👇 Catch-all: anything not matched above → /app */
  { path: '*', element: <Navigate to="/app" replace /> },
];
export default routes;
