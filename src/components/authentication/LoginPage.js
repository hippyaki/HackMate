import React from 'react';
import AuthService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const onSignIn = async () => {
    const result = await AuthService.signInWithGoogle();
    const user = result.user;
    // call your backend to create user doc if needed
    await fetch('/api/createUser', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        uid: user.uid, name: user.displayName, username: user.displayName?.replace(/\s+/g,'').toLowerCase(),
        email: user.email, photoURL: user.photoURL
      })
    });
    navigate('/');
  };

  return (
    <div style={{display:'flex', flexDirection:'column',alignItems:'center', marginTop:80}}>
      <img src="/hackmate-logo.png" style={{width:120}} alt="HackMate" />
      <h2>Sign in with Google</h2>
      <button onClick={onSignIn}>Sign in with Google</button>
    </div>
  );
}
