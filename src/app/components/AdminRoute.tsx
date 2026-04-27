import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
