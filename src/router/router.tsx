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
import { ResetPasswordPage } from "../auth/ResetPasswordPage";
import { AdminGuard } from "../auth/Guard/AdminGuard";
import { ChangePasswordComponent } from "../auth/ChangePasswordComponent";

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
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
      { path: "changePassword", element: <ChangePasswordComponent/>},
      { 
        path: 'admin', 
        element: (
          <AdminGuard>
            <AdminUsersPage />
          </AdminGuard>
        ) 
      }
    ],
  },
  { path: '*', element: <Navigate to="/app" replace /> },
];
export default routes;