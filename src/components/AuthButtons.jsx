import { Link } from "react-router-dom";

function AuthButtons() {
  return (
    <div className="auth-buttons">
      <Link
        to="/Login"
        className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 font-medium"
      >
        Login
      </Link>
      <Link
        to="/Register"
        className="px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200 font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
}

export default AuthButtons;
