import axios from "axios";
import { AuthAPI, LogoutAPI, ProfileAPI } from "../../components/api/api";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const BuyerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [role, SetRole] = useState(null);
  const [user, SetUser] = useState(null);
  const profileRef = useRef();

  const isActive = (path) => location.pathname === path;

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        SetRole(null);
      } else {
        await axios
          .get(AuthAPI, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            SetRole(res.data.value);
            axios
              .post(
                ProfileAPI,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                SetUser(res.data.value);
              })
              .catch((error) => {
                window.alert(error.response.data.msg);
                localStorage.removeItem("token");
                navigate("/");
              });
          })
          .catch((error) => {
            window.alert("something went wrong. Try after sometimes");
            localStorage.removeItem("token");
            navigate("/");
          });
      }
    };

    checkToken();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let LogoutHandler = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .post(
          LogoutAPI,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          window.alert(res.data.msg);
          localStorage.removeItem("token");
          navigate("/");
        })
        .catch((error) => {
          window.alert(error.response.data.msg);
          localStorage.removeItem("token");
          navigate("/");
        });
    }
  };

  return (
    <header className="buyer-header">
      <div className="header-left" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      {role && (
        <nav className="header-center">
          <button
            className={isActive(`/${role.role}/dashboard`) ? "active" : ""}
            onClick={() => navigate(`/${role.role}/dashboard`)}
          >
            Dashboard
          </button>
          <button
            className={isActive(`/${role.role}/deals`) ? "active" : ""}
            onClick={() => navigate(`/${role.role}/deals`)}
          >
            Deals
          </button>
          <button
            className={isActive(`/${role.role}/transaction`) ? "active" : ""}
            onClick={() => navigate(`/${role.role}/transaction`)}
          >
            Transaction
          </button>
        </nav>
      )}

      {role && (
        <div className="header-right" ref={profileRef}>
          <span className="notification-icon">🔔</span>
          <span className="user-name" onClick={toggleProfile}>
            {role.name}
          </span>

          {showProfile && user && (
            <div className="profile-card">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button onClick={LogoutHandler}>Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default BuyerHeader;
