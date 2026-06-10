import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { authService } from "../../services/auth/auth.service";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const location = useLocation();

  // 1. Check token hợp lệ
  if (!authService.isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  const user = authService.getUserProfile();
  const userRole = user?.role; 

  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some(role => {
      if (!userRole) return false;
      const cleanRole = role.replace("ROLE_", "");
      const cleanUserRole = userRole.replace("ROLE_", "");
      return cleanRole === cleanUserRole;
    });

    if (!hasPermission) {
      console.warn(
        `Truy cập bị từ chối: Yêu cầu [${allowedRoles}], nhưng user có [${userRole}]`
      );

      if (userRole && (userRole.includes("ADMIN") || userRole.includes("SALE"))) {
        return <Navigate to="/admin" replace />;
      }

      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}