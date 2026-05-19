import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { authService } from "../services/auth/auth.service";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // lấy info từ JWT
  const user = authService.getUserProfile();

  const adminRoles = ["ADMIN", "ROLE_ADMIN"];

  if (!user || !adminRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}