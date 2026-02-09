import { useState, useEffect, useRef } from "react";
import "./Register.css";
import { FaCheck, FaTimes, FaUser, FaLock } from "react-icons/fa";

const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%<>]).{8,24}$/;

function Register() {
  const userRef = useRef();
  const errRef = useRef();
  const pwdRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

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
        <h1>Register</h1>
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <span>Username:</span>
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
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span>Password:</span>
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
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters: ! @ # $ %
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_pwd" className="form-label">
              <span>Confirm Password:</span>
              <span
                className={
                  validMatch && matchPwd ? "valid validation-icon" : "hide"
                }
              >
                <FaCheck />
              </span>
              <span
                className={
                  !validMatch && matchPwd ? "invalid validation-icon" : "hide"
                }
              >
                <FaTimes />
              </span>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className="form-input"
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              Must match the password input field.
            </p>
          </div>

          <button
            disabled={!validName || !validPwd || !validMatch}
            className="submit-button"
          >
            Sign Up
          </button>
        </form>
        <p className="signin-prompt">
          Already registered?
          <br />
          <span className="line">
            <a href="#" className="signin-link">
              Sign In
            </a>
          </span>
        </p>
      </section>
    </div>
  );
}

export default Register;
