
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthAPI } from "./api/api";

const ProtectedRoute = ({ children, props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState({ loading: true, valid: false });

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        const fallback =
          props === "login"
            ? "login"
            : props === "register"
            ? "register"
            : "login";
        setStatus({ loading: false, valid: false });
        navigate(`/${fallback}`);
        return;
      }

      try {
        const res = await axios.get(AuthAPI, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRole = res?.data?.value?.role;
        const pathname = location.pathname;

        // Check if path already includes role correctly
        if (
          pathname.startsWith(`/${userRole}`) ||
          pathname === "/" // root route
        ) {
          setStatus({ loading: false, valid: true });
          return;
        }

        // Redirect only when misaligned
        let baseRedirect =
          props === "login" || props === "register" ? "dashboard" : props;

        navigate(`/${userRole}/${baseRedirect}`);
        setStatus({ loading: false, valid: true });
      } catch (err) {
        setStatus({ loading: false, valid: false });
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate, location.pathname]);

  return status.loading ? <p>Loading...</p> : children;
};

export default ProtectedRoute;
