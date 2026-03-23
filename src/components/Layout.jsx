import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>

      <style>{`
        .layout-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .layout-main {
          margin-left: 240px;
          flex: 1;
          overflow-y: auto;
          transition: margin-left 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .layout-main {
            margin-left: 0;
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
}
