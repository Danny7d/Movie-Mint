import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";

function Login() {
  const userRef = useRef();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const [user, setUser] = useState("");
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwdFocus, setPwdFocus] = useState(false);

  const { session, signIn } = UserAuth();

  // Simple validation: username (4+ chars starting with letter) or email
  const isValidInput = user.length >= 4;
  const isValidPwd = pwd.length >= 8;

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInput || !isValidPwd) {
      setErrMsg("Please fill in all fields correctly");
      return;
    }

    try {
      const result = await signIn(user, pwd);
      if (result.success) {
        navigate("/");
      } else {
        setErrMsg(result.error?.message || "Login failed");
      }
    } catch (error) {
      setErrMsg("Login failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <section className="register-section">
        <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <h1>Login</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <span>Email or Username</span>
              <span className={isValidInput ? "valid validation-icon" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  isValidInput || !user ? "hide" : "invalid validation-icon"
                }
              >
                <FaTimes />
              </span>
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={isValidInput ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className="form-input"
              placeholder="Enter your email or username"
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !isValidInput ? "instructions" : "offscreen"
              }
            >
              Enter your email address or username
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span>Password</span>
              <span className={isValidPwd ? "valid validation-icon" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  isValidPwd || !pwd ? "hide" : "invalid validation-icon"
                }
              >
                <FaTimes />
              </span>
            </label>
            <input
              type="password"
              id="password"
              autoComplete="off"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={isValidPwd ? "false" : "true"}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className="form-input"
            />
          </div>
          <button
            disabled={!isValidInput || !isValidPwd}
            className="submit-button"
          >
            Login
          </button>
        </form>
        <p className="signin-prompt">
          Don't have an account?
          <br />
          <span className="line">
            <Link to="/Register" className="signin-link">
              Sign Up
            </Link>
          </span>
        </p>
      </section>
    </div>
  );
}

export default Login;
