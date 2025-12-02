// router.tsx - Versión final
import { Navigate, type RouteObject } from "react-router-dom";
import { LoginComponent } from "../auth/LoginComponent";
import LayoutApp from "../layouts/LayoutApp";
import { RequireAuth } from "../auth/RequireAuth";
import { DocumentPage } from "../Components/Documents/DocumentPage";
import { EditorStudioComponent } from "../Components/EditorStudioComponent";
import { FolderPage } from "../Components/Documents/Folderpage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/app" replace />,
  },
  {
    path: "/login",
    element: <LoginComponent />,
  },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <LayoutApp />
      </RequireAuth>
    ),
    children: [
      { path: "editor/:operation?/:documentId?", element: <EditorStudioComponent/> },
      { path: "documents", element: <DocumentPage /> },
      { path: "folders/:folderId", element: <FolderPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/app" replace /> },
];
export default routes;