import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactElement; // must be a single React element
};

const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
