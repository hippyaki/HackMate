// src/LoginPage.js
import React, { useState } from 'react';
import AuthService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const LoginPage = ({ switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Email Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Input validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const result = await AuthService.loginWithEmail(email, password);
    
    if (result.success) {
      // Successful login - handle navigation or state update
      console.log('Logged in user:', result.user);
      // Example: Navigate to swipe or update app state
      navigate('/swipe');
      // console.log(await AuthService.getCurrentUser);
    } else {
      // Login failed
      setError(result.error.message);
    }
  };
  

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setError(null);

    const result = await AuthService.signInWithGoogle();
    
    if (result.success) {
      // Successful Google login - handle navigation or state update
      console.log('Google logged in user:', result.user);

      try {
        // 1️⃣ Check if uuid exists
        const checkResponse = await fetch(`https://hackmate-rv8q.onrender.com/api/users/check/${result.user.uid}`);
        const checkData = await checkResponse.json();

        if (!checkData.exists) {
          // 2️⃣ uuid does not exist → create new user
          const createResponse = await fetch('https://hackmate-rv8q.onrender.com/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uuid: result.user.uid,
              name: result.user.displayName,
              username: "",
              email: result.user.email,
              photoURL: result.user.photoURL
            })
          });

          const createData = await createResponse.json();
          console.log('User created:', createData);
        } else {
          console.log('Username already exists, skipping creation');
        }
        // Navigate or update state after login
        navigate('/swipe');
      } catch (err) {
        console.error('Error checking/creating user:', err);
        setError('Failed to verify user.');
      }
    } else {
      // Login failed
      setError(result.error.message);
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-gray-100 p-4 relative overflow-hidden font-sans">
      
      {/* Floating Animated Rockets */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.4,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              color: "#FF8C00",
              filter: "drop-shadow(0 0 8px #FF8C00)",
            }}
          >
            🚀
          </motion.div>
        ))}
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/10 shadow-2xl rounded-3xl p-8 z-10">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/hackmate-login.png"
            alt="HackMate Logo"
            className="h-40 w-auto object-contain"
          />
        </div>
        <div className=" text-8xl text-center">
          <h1 style={{ fontFamily: 'HackMateFont' }}>HackMate</h1>
        </div>

        <h2 className="text-xl text-center font-bold text-[#FF8C00] mb-6 tracking-wide">
         Get Started!
        </h2>

        {error && (
          <div
            className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="button"
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-md text-base font-semibold text-black bg-[#FF8C00] hover:bg-[#FFA733] transition-all duration-200"
          onClick={handleGoogleSignIn}
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 
              0-12-5.373-12-12s5.373-12 12-12c3.059 
              0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 
              6.053 29.268 4 24 4 12.955 4 4 
              12.955 4 24s8.955 20 20 20 20-8.955 
              20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="m6.306 14.691 6.571 4.819C14.655 
              15.108 18.961 12 24 12c3.059 0 
              5.842 1.154 7.961 3.039l5.657-5.657C34.046 
              6.053 29.268 4 24 4 16.318 4 9.656 
              8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 
              13.409-5.192l-6.19-5.238A11.91 11.91 0 
              0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 
              5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 
              12.04 0 0 1-4.087 5.571l.002-.001 
              6.19 5.238C36.971 39.205 44 34 44 
              24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          By continuing, you agree to HackMate’s{" "}
          <span className="text-[#FF8C00] cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="text-[#FF8C00] cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>

  );
};


export default LoginPage;