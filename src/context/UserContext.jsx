import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/api";

function isTokenValid() {
  const token = localStorage.getItem("jwtToken");
  if (!token || token === "undefined" || token === "null") return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) return payload.exp * 1000 > Date.now();
    return true;
  } catch {
    return false;
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isTokenValid()) {
      getMe().then(setUser).catch(() => {});
    }
  }, []);

  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Falls back to a logged-out shape rather than null, so components that render
// outside the provider (notably the route errorElement, which replaces <App/>
// and therefore its providers) degrade instead of throwing.
const LOGGED_OUT = { user: null, setUser: () => {}, clearUser: () => {} };
export const useUser = () => useContext(UserContext) ?? LOGGED_OUT;
