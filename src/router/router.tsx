// router.tsx - Versión final
import { Navigate, type RouteObject } from "react-router-dom";
import { LoginComponent } from "../auth/LoginComponent";
import LayoutApp from "../layouts/LayoutApp";
import { RequireAuth } from "../auth/RequireAuth";
import { DocumentPage } from "../Components/Documents/DocumentPage";
import { EditorStudioComponent } from "../Components/EditorStudioComponent";
import { FolderPage } from "../Components/Documents/Folderpage";
import { ApiKeyPage } from "../Components/ApiKey/ApiKeyPage";
import { AdminUsersPage } from "../Components/Admin/AdminUsersPage";
import { VerifyEmailPage } from "../auth/VerifyEmailPage";

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
    path: "/verify-email",
    element: <VerifyEmailPage />,
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
      { path: "api-key", element: <ApiKeyPage /> },
      { path: 'admin', element: <AdminUsersPage />}
    ],
  },
  { path: '*', element: <Navigate to="/app" replace /> },
];
export default routes;