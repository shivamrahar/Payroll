import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // For development: skip authentication and go straight to /tool-a
    const userEmail = email || 'test@carebridge.com';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', userEmail);
    navigate('/tool-a');
  };

  return (
    <div className="login-background">
      <div className="login-overlay"></div>
      <div className="login-container">
        <h1 className="login-title">Care Bridge Payroll & Mileage Calculator</h1>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address (optional for dev)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password (optional for dev)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>

      <style>{`
        .login-background {
          position: relative;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .login-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
        }

        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 40px;
        }

        .login-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 32px;
          color: #1a1a1a;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: -12px;
          text-align: center;
        }

        .login-button {
          width: 100%;
          padding: 12px 16px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .login-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .login-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
