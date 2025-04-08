import { useState, useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { jwtDecode } from "jwt-decode";
// import "../styles/Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in|co)$/;
  const passwordPattern = /^[A-Za-z0-9@#$%^&+=!]{6,15}$/;

  const validate = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format (Allowed: .com, .in, .co)";
      isValid = false;
    }

    if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Password must be 6-15 chars (A-Z, 0-9, @#$%^&+=!)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await login(formData.email, formData.password, "login");
    let token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      navigate(`/${decode.role}/dashboard`);
    } else {
      return
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            maxLength={30}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              maxLength={15}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <span
              className="eye-icon"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🔒"}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">Login</button>
        </form>
        <div>
          <p>New User ? <a href="/register">SignUp</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
