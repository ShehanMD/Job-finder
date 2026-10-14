
import React from 'react';
import './Login.css';
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { customBase } from "../firebase/customBase";
import { useNavigate } from 'react-router-dom';



export default function Login({ onClose }) {
  const navigate = useNavigate();

  const [logginEmail, setEmail] = React.useState('');
  const [logginPass, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function haddleloggin(e) {
    e.preventDefault();

    if (!logginEmail || !logginPass) {
      alert("Please Fill All");
      return;
    }

    try {
      setLoading(true);

      // Sign in with Firebase
      const logResults = await customBase.auth.signIn(
        logginEmail,
        logginPass
      );

      // Get the user's data from the database
      const userData = await customBase.db.get(
        `USER/${logResults.uid}`
      );

      // Navigate according to the user's role
      if (userData?.role === 'employer') {
        navigate('/employer');
        onClose?.();

      } else if (userData?.role === 'seeker') {
        navigate('/seeker');
        onClose?.();

      } else {
        alert("Invalid user role!");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert(error?.message || error?.code || "Login failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
      >
        <button
          className="close-btn"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>

        <h2
          style={{
            fontSize: '26px',
            margin: '0 0 5px 0',
            color: '#fff'
          }}
        >
          Sign in
        </h2>

        <p
          style={{
            color: '#ffff',
            fontSize: '13px',
            margin: '0 0 30px 0'
          }}
        >
          Dont have an account?{' '}
          <a href="/" style={{ color: '#00c49f' }}>
            Register
          </a>
        </p>

        <form onSubmit={haddleloggin}>
          <div className="form-group">
            <label>Email</label>
            <Input
              value={logginEmail}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your E-mail"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <Input
              value={logginPass}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your Password"
            />
          </div>

          <div className="btn-row">
            <Button
              type="submit"
              className="btn-primary"
              style={{ width: '50%' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>

            <Button
              type="button"
              className="btn-primary"
              variant="gray"
              style={{ width: '50%' }}
              onClick={onClose}
            >
              Back
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="white"
              onClick={customBase.auth.googleSignIn}
              className="w-full gap-2"
            >
              <FcGoogle className="text-lg" />
              Login with Google
            </Button>

            <Button
              type="button"
              variant="white"
              className="w-full gap-2"
            >
              <FaFacebook className="text-blue-600 text-lg" />
              Login with Facebook
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
