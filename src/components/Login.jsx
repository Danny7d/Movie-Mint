import { useState, useEffect, useRef } from "react";
import "./Register.css";
import { FaCheck, FaTimes, FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%<>]).{8,24}$/;

function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const pwdRef = useRef();

  const [user, setUser] = useState("");
  const validName = USER_REGEX.test(user);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const validPwd = PWD_REGEX.test(pwd);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  return (
    <div className="register-container">
      <section className="register-section">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Login</h1>
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <span>Username</span>
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
            />
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
              aria-describedby="pwdnote"
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
