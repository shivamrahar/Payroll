import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className="hamburger-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-brand">Care Bridge</h1>
          <button
            className="close-button"
            onClick={() => setIsMobileOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => handleNavClick('/tool-a')}
            className={`nav-item ${isActive('/tool-a') ? 'active' : ''}`}
          >
            <MapPinIcon />
            <span>Calculate Patient Addresses</span>
          </button>

          <button
            onClick={() => handleNavClick('/tool-b')}
            className={`nav-item ${isActive('/tool-b') ? 'active' : ''}`}
          >
            <CalculatorIcon />
            <span>Calculate Payroll Summary and Mileage</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email-sidebar">{userEmail}</span>
          </div>
          <button onClick={handleLogout} className="logout-button-sidebar">
            Logout
          </button>
        </div>

        <style>{`
          .hamburger-button {
            display: none;
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 105;
            width: 44px;
            height: 44px;
            padding: 8px;
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            color: #374151;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .hamburger-button:hover {
            background-color: #f9fafb;
            border-color: #2563eb;
            color: #2563eb;
          }

          .hamburger-button svg {
            width: 24px;
            height: 24px;
          }

          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 99;
          }

          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 240px;
            height: 100vh;
            background-color: #ffffff;
            border-right: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
            z-index: 100;
            transition: transform 0.3s ease;
          }

          .sidebar-header {
            padding: 24px 20px;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .sidebar-brand {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            letter-spacing: -0.5px;
          }

          .close-button {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            color: #6b7280;
            width: 32px;
            height: 32px;
            padding: 0;
          }

          .close-button:hover {
            color: #1f2937;
          }

          .close-button svg {
            width: 24px;
            height: 24px;
          }

          .sidebar-nav {
            flex: 1;
            padding: 16px 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow-y: auto;
          }

          .nav-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background-color: transparent;
            border: none;
            border-radius: 6px;
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            font-family: inherit;
          }

          .nav-item:hover {
            background-color: #f3f4f6;
            color: #374151;
          }

          .nav-item.active {
            background-color: #dbeafe;
            color: #2563eb;
            font-weight: 600;
          }

          .nav-item svg {
            flex-shrink: 0;
            width: 18px;
            height: 18px;
          }

          .sidebar-footer {
            padding: 16px 12px;
            border-top: 1px solid #f3f4f6;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .user-info {
            padding: 0 16px;
          }

          .user-email-sidebar {
            display: block;
            font-size: 12px;
            color: #9ca3af;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .logout-button-sidebar {
            width: 100%;
            padding: 10px 16px;
            background-color: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
          }

          .logout-button-sidebar:hover {
            background-color: #dc2626;
          }

          .logout-button-sidebar:active {
            transform: translateY(0.5px);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .hamburger-button {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .sidebar-overlay {
              display: block;
            }

            .sidebar {
              transform: translateX(-100%);
              width: 280px;
              box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
            }

            .sidebar.mobile-open {
              transform: translateX(0);
            }

            .close-button {
              display: block;
            }
          }
        `}</style>
      </aside>
    </>
  );
}

function MapPinIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3v-3m-3 3v-3m-3-10v16a2 2 0 002 2h12a2 2 0 002-2V7m-15 0V5a2 2 0 012-2h6a2 2 0 012 2v2m0 0h4a2 2 0 012 2v2"
      />
    </svg>
  );
}

