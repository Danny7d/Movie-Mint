import { Link } from "react-router-dom";
import "./Register.css";

function CheckEmail() {
  return (
    <div className="register-container">
      <section className="register-section">
        <div className="text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
          
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
            <p className="text-gray-300 mb-4">
              We've sent a confirmation email to your registered email address.
            </p>
            <p className="text-gray-400 text-sm">
              Please click the confirmation link in the email to activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Next Steps:</h3>
              <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                <li>Check your inbox for the confirmation email</li>
                <li>Click the confirmation link in the email</li>
                <li>Return here to sign in to your account</li>
              </ol>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">
                Didn't receive the email?
              </p>
              <p className="text-gray-500 text-xs">
                Check your spam folder or try registering again with a different email address.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              to="/Login"
              className="block w-full px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 font-medium text-center"
            >
              Go to Login
            </Link>
            
            <Link
              to="/"
              className="block w-full px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckEmail;
