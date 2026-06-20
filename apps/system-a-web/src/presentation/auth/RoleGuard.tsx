import type { ReactNode } from "react";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { useAuth } from "./AuthContext";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const auth = useAuth();
  const isAllowed = auth.roles.some((role) => allowedRoles.includes(role));

  if (!isAllowed) {
    return <AccessDeniedPage allowedRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
