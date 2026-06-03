import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { getMe } from "../services/api";
import { useUser } from "../context/UserContext";

export default function OAuth2Callback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      navigate(`/login?error=${encodeURIComponent(error || "OAuth sign-in failed.")}`, { replace: true });
      return;
    }

    localStorage.setItem("jwtToken", token);
    getMe()
      .then((me) => { setUser(me); navigate("/arena/problemset", { replace: true }); })
      .catch(() => navigate("/arena/problemset", { replace: true }));
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Spinner size="md" color="primary" />
    </div>
  );
}
