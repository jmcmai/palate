import React from 'react';
import LoginButton from '../components/LoginButton';
import Logo from '../images/logo.svg';

import './Login.css'

const Login: React.FC = () => {
  return (
    <main className="log-in-screen">
      <img className="welcome-logo" src={Logo} alt="Logo" />
      <h1 className="welcome"> Let's Get Cookin'! </h1>
      <h2>
        <LoginButton />
      </h2>
    </main>
  );
};

export default Login;