import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import ForgotPass from "./ForgotPassword";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const location = useLocation();
  const errorMessage = location.state && location.state.errorMessage;
  const [showEmailWindow, setShowEmailWindow] = useState(false);

  const handleForgotEmail = () => {
    setShowEmailWindow(true);
  };

  const handleCloseForgotEmail = () => {
    setShowEmailWindow(false);
  };
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/guest/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsername(data.username); // Store the username in state

        switch (data.type) {
          case "patient":
            navigate("/patient");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "pharmacist":
            navigate("/pharmacist");
            break;
          default:
            // Handle other user types or provide a default redirect
            navigate("/");
        }
      } else {
        setError("Username or password might be incorrect.");
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-cover">
        <div className="login-container container">
          <div className="login-card card">
            {errorMessage && (
              <p className="error" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}
            <div className="login-form">
              <h2 className="wb">Welcome back!</h2>
              <div className="wb">Log in to El7a2ni</div>
              <br />
              <input
                className="login-input form-control"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
                className="login-input form-control"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <a className="forgot" onClick={handleForgotEmail}>
                Forgot password?
              </a>
              {showEmailWindow && (
                <div className="modal-overlay">
                  <div className="email-card card">
                    <div className="forgotPass">
                      <ForgotPass />
                    </div>
                    <button
                      className="close-btn btn btn-secondary btn-default-width"
                      onClick={handleCloseForgotEmail}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <br />
              <button
                className="login-btn btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
              <hr />
              <Link to="/" className="createAcc-btn btn btn-primary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
