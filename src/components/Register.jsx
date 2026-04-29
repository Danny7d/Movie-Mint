import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%<>]).{8,24}$/;

function Register() {
  const emailRef = useRef();
  const navigate = useNavigate();
  const { session, signUpNewUser } = UserAuth();
  const { checkUsernameAvailability } = useUserProfile();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  // Debounced username availability check
  useEffect(() => {
    if (!validName || user.length < 5) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      const result = await checkUsernameAvailability(user);
      setUsernameAvailable(result.available);
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, validName, checkUsernameAvailability]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validEmail || !validName || !validPwd || !validMatch) {
      setErrMsg("Invalid Entry");
      return;
    }

    if (usernameAvailable === false) {
      setErrMsg("Username is already taken. Please choose another.");
      return;
    }

    try {
      const result = await signUpNewUser(email, pwd, user);

      if (!result.success) {
        setErrMsg(result.error?.message || "Registration Failed");
        return;
      }

      setEmail("");
      setUser("");
      setPwd("");
      setMatchPwd("");
      navigate("/check-email");
    } catch (error) {
      setErrMsg(error.message || "Registration Failed");
    }
  };

  return (
    <div className="register-container">
      <section className="register-section">
        <p
          ref={null}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Register</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span>Email</span>
              <span className={validEmail ? "valid validation-icon" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  !validEmail && email ? "invalid validation-icon" : "hide"
                }
              >
                <FaTimes />
              </span>
            </label>

            <input
              type="email"
              ref={emailRef}
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              aria-invalid={validEmail ? "false" : "true"}
            />

            <p
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              Must be a valid email address (example@email.com)
            </p>

            <label htmlFor="username" className="form-label">
              <span>Username</span>
              <span className="validation-icon-group">
                {checkingUsername && (
                  <span className="checking-icon">⏳</span>
                )}
                {validName && usernameAvailable === true && !checkingUsername && (
                  <span className="valid validation-icon"><FaCheck /></span>
                )}
                {validName && usernameAvailable === false && !checkingUsername && (
                  <span className="invalid validation-icon"><FaTimes /></span>
                )}
                {!validName && user && (
                  <span className="invalid validation-icon"><FaTimes /></span>
                )}
              </span>
            </label>
            <input
              type="text"
              id="username"
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className="form-input"
            />
            {validName && usernameAvailable === true && !checkingUsername && (
              <p className="username-available">✓ Username is available</p>
            )}
            {validName && usernameAvailable === false && !checkingUsername && (
              <p className="username-taken">✗ Username is already taken</p>
            )}
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
              Letters, numbers, underscores allowed.
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
              autoComplete="off"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
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
              <span>Confirm Password</span>
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
              value={matchPwd}
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
            disabled={
              !validName ||
              !validPwd ||
              !validMatch ||
              !validEmail ||
              usernameAvailable === false ||
              checkingUsername
            }
            className="submit-button"
          >
            Sign Up
          </button>
        </form>
        <p className="signin-prompt">
          Already registered?
          <br />
          <span className="line">
            <Link to="/Login" className="signin-link">
              Sign In
            </Link>
          </span>
        </p>
      </section>
    </div>
  );
}

export default Register;
