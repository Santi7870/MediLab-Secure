import { Navigate, Route, Routes } from "react-router-dom";
import { AuthGate } from "../auth/AuthGate";
import { RoleGuard } from "../auth/RoleGuard";
import { AppLayout } from "../components/AppLayout";
import { AdminConsolePage } from "../pages/AdminConsolePage";
import { DashboardPage } from "../pages/DashboardPage";
import { LaboratoryWorkspacePage } from "../pages/LaboratoryWorkspacePage";
import { LabResultsPage } from "../pages/LabResultsPage";
import { PatientsPage } from "../pages/PatientsPage";

export function AppRouter() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppLayout />} path="/">
          <Route index element={<DashboardPage />} />
          <Route
            element={
              <RoleGuard allowedRoles={["portal-admin"]}>
                <AdminConsolePage />
              </RoleGuard>
            }
            path="admin"
          />
          <Route
            element={
              <RoleGuard
                allowedRoles={[
                  "clinical-operator",
                  "portal-admin",
                  "result-coordinator",
                  "compliance-reviewer"
                ]}
              >
                <LaboratoryWorkspacePage />
              </RoleGuard>
            }
            path="laboratory"
          />
          <Route
            element={
              <RoleGuard allowedRoles={["clinical-operator", "portal-admin", "compliance-reviewer"]}>
                <PatientsPage />
              </RoleGuard>
            }
            path="patients"
          />
          <Route
            element={
              <RoleGuard
                allowedRoles={[
                  "clinical-operator",
                  "portal-admin",
                  "result-coordinator",
                  "compliance-reviewer"
                ]}
              >
                <LabResultsPage />
              </RoleGuard>
            }
            path="patients/:patientId/lab-results"
          />
          <Route element={<Navigate to="/" replace />} path="*" />
        </Route>
      </Routes>
    </AuthGate>
  );
}
