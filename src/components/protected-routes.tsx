import { Navigate, Outlet } from "react-router";

interface ProtectedRoutesProps {
  allowedRoles?: string[];
}

import { useAuth } from "@/context/state.context.tsx";

export default function ProtectedRoutes({
  allowedRoles,
}: ProtectedRoutesProps) {
  const { isAuth, role } = useAuth();

  // If not authenticated
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = role;

  if (allowedRoles && allowedRoles.length > 0 && userRole) {
    const normalizedRoles = allowedRoles.map((r) => r.toUpperCase());
    const normalizedUserRole = userRole.toUpperCase();

    if (!normalizedRoles.includes(normalizedUserRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
