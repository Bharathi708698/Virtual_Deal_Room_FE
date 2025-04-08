import { useState, useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const namePattern = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+){0,2}$/;
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in|co)$/;
  const passwordPattern = /^[A-Za-z0-9@#$%^&+=!]{6,15}$/;

  const validate = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!namePattern.test(formData.name)) {
      newErrors.name = "Name should be AlphaNumeric with maximum of two spaces";
      isValid = false;
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format (Allowed: .com, .in, .co)";
      isValid = false;
    }

    if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Password must be 6-15 chars (A-Z, 0-9, @#$%^&+=!)";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      "register"
    );
    let token = localStorage.getItem("token");
    if(token){
      const decode = jwtDecode(token);
      navigate(`/${decode.role}/dashboard`);
    } else {
     return 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            maxLength={30}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}

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

          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              maxLength={15}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
            <span
              className="eye-icon"
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "🔒"}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
          <select
            name="role"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button type="submit">Register</button>
        </form>
        <div>
          <p>Already logged In ? <a href="/login">signIn</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
