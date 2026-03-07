import { Navigate, Outlet } from "react-router";

interface ProtectedRoutesProps {
  allowedRoles?: string[];
}

export default function ProtectedRoutes({
  allowedRoles,
}: ProtectedRoutesProps) {
  const userStr = localStorage.getItem("user");
  let userRole = null;

  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      // Try to extract the role from wherever the backend puts it in the response
      userRole = user?.role || user?.data?.role || localStorage.getItem("role");
    }
  } catch (e) {
    userRole = localStorage.getItem("role");
  }

  // If no role found, user is not authenticated/registered
  if (!userStr && !userRole) {
    return <Navigate to="/auth" replace />;
  }

  // If the route has specific allowed roles and the user's role is not among them
  if (allowedRoles && allowedRoles.length > 0 && userRole) {
    // If we have roles, check if the current user has access
    // We lowercase or uppercase everything to make matching safer
    const normalizedRoles = allowedRoles.map((r) => r.toUpperCase());
    const normalizedUserRole = userRole.toUpperCase();

    if (!normalizedRoles.includes(normalizedUserRole)) {
      // Redirect to unauthorized or back home
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
