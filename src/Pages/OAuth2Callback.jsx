import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../Components/Spinner";
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
      // "OAuth" is our word, not the user's — they pressed a button labelled
      // GitHub or Google. Name what they did, and give them the other door.
      navigate(`/login?error=${encodeURIComponent(error || "That sign-in didn't finish. Try again, or use your username and password.")}`, { replace: true });
      return;
    }

    localStorage.setItem("jwtToken", token);
    getMe()
      .then((me) => { setUser(me); navigate("/arena/problemset", { replace: true }); })
      .catch(() => navigate("/arena/problemset", { replace: true }));
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Spinner size={28} label="Signing you in" />
    </div>
  );
}
