import { Navigate, Outlet } from "react-router-dom";

function isTokenValid() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute() {
  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
}
