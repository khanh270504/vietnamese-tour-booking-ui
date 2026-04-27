import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentUserStr = localStorage.getItem("currentUser");
    
    if (currentUserStr) {
      const user = JSON.parse(currentUserStr);
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; 
      }
    }
  }

  return <Outlet />;
}