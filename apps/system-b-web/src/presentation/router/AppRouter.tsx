import { Navigate, Route, Routes } from "react-router-dom";
import { AuthGate } from "../auth/AuthGate";
import { RoleGuard } from "../auth/RoleGuard";
import { AppLayout } from "../components/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { LabLookupPage } from "../pages/LabLookupPage";
import { OperationsPage } from "../pages/OperationsPage";
import { OversightPage } from "../pages/OversightPage";

export function AppRouter() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppLayout />} path="/">
          <Route index element={<DashboardPage />} />
          <Route
            element={
              <RoleGuard allowedRoles={["lab-admin", "lab-operator", "lab-clinician", "quality-auditor"]}>
                <LabLookupPage />
              </RoleGuard>
            }
            path="lookup"
          />
          <Route
            element={
              <RoleGuard allowedRoles={["lab-admin", "lab-operator"]}>
                <OperationsPage />
              </RoleGuard>
            }
            path="operations"
          />
          <Route
            element={
              <RoleGuard allowedRoles={["lab-admin", "quality-auditor"]}>
                <OversightPage />
              </RoleGuard>
            }
            path="oversight"
          />
          <Route element={<Navigate to="/" replace />} path="*" />
        </Route>
      </Routes>
    </AuthGate>
  );
}
