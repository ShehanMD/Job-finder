
import React from 'react';
import './Login.css';
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';


export default function Login({ onClose }) {
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
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2 style={{ fontSize: '26px', margin: '0 0 5px 0', color: '#fff' }}>Sign in</h2>
        <p style={{ color: '#ffff', fontSize: '13px', margin: '0 0 30px 0' }}>Dont have an account? <a href="/" style={{ color: '#00c49f' }}>Register</a></p>

        <form>
          <div className="form-group">
            <label>Email</label>
            <Input type="email" placeholder={"Enter your E-mail"} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <Input type="password" placeholder={"Enter your Password"} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <Input type="password" placeholder={"Confirm your Password"} />
          </div>

          <div className="btn-row">
            <Button type="button" className="btn-primary" style={{ width: '50%' }}>Log in</Button>
            <Button type="button" className="btn-primary" variant='gray' style={{ width: '50%' }} onClick={onClose}>
              Back
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            <Button type="button" variant="white" className="w-full gap-2">
              <FcGoogle className="text-lg" />
              Login with Google
            </Button>

            <Button type="button" variant="white" className="w-full gap-2">
              <FaFacebook className="text-blue-600 text-lg" />
              Login with Facebook
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}