import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaCheck, FaTimes, FaUser, FaLock } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";

const USER_REGEX =
  /^[A-Za-z][A-Za-z0-9_]{4,29}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%<>]).{8,24}$/;

function Login() {
  const userRef = useRef();
  const pwdRef = useRef();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const [user, setUser] = useState("");
  const validName = USER_REGEX.test(user);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const validPwd = PWD_REGEX.test(pwd);
  const [pwdFocus, setPwdFocus] = useState(false);

  const { session, signIn } = UserAuth();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validName || !validPwd) {
      setErrMsg("Invalid credentials");
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
              <span className={validName ? "valid validation-icon" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  validName || !user ? "hide" : "invalid validation-icon"
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
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className="form-input"
              placeholder="Enter your email or username"
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              Enter your email address or username
              <br />
              Email: example@email.com
              <br />
              Username: 4 to 24 characters, starts with a letter
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span>Password</span>
              <span className={validPwd ? "valid validation-icon" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  validPwd || !pwd ? "hide" : "invalid validation-icon"
                }
              >
                <FaTimes />
              </span>
            </label>
            <input
              type="password"
              id="password"
              ref={pwdRef}
              autoComplete="off"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className="form-input"
            />
          </div>
          <button disabled={!validName || !validPwd} className="submit-button">
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
