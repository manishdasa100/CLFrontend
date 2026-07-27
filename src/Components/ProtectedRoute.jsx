import { Navigate, Outlet, useLocation } from "react-router-dom";

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

// A logged-out visitor lands here from a specific link (Browse problems, a
// profile, ...). Tell them why they're seeing a login screen, and remember
// where they were headed so sign-in returns them there instead of a generic page.
function reasonFor(pathname) {
  if (pathname.startsWith("/arena")) return "Sign in to start solving problems.";
  if (pathname.startsWith("/profile")) return "Sign in to view profiles.";
  return "Sign in to continue.";
}

export default function ProtectedRoute() {
  const location = useLocation();
  if (isTokenValid()) return <Outlet />;
  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location, reason: reasonFor(location.pathname) }}
    />
  );
}
