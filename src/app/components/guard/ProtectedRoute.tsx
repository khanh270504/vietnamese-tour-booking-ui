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

  // check token hợp lệ
  if (!authService.isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // lấy user từ JWT
  const user = authService.getUserProfile();

  // check role
  if (allowedRoles && allowedRoles.length > 0) {

    if (!user || !allowedRoles.includes(user.role)) {

      console.warn(
        `Truy cập bị từ chối: Yêu cầu [${allowedRoles}], nhưng user có [${user?.role}]`
      );

      return <Navigate to="/" replace />;
    }
  }

  // hỗ trợ cả children lẫn nested routes
  return children ? <>{children}</> : <Outlet />;
}