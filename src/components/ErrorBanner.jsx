import React, { useState, useEffect } from 'react';

export default function ErrorBanner({ message, onDismiss }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!isVisible || !message) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="error-banner">
      <div className="error-banner-content">
        <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <span className="error-message">{message}</span>
      </div>
      <button className="error-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </button>

      <style>{`
        .error-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-bottom: 2px solid #fca5a5;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          z-index: 1000;
          animation: slideDown 0.3s ease-out;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .error-banner-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          color: #dc2626;
          flex-shrink: 0;
        }

        .error-message {
          font-size: 14px;
          font-weight: 500;
          color: #7f1d1d;
          line-height: 1.4;
        }

        .error-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .error-dismiss:hover {
          background-color: rgba(220, 38, 38, 0.1);
          border-radius: 4px;
        }

        .error-dismiss svg {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 768px) {
          .error-banner {
            padding: 12px 16px;
            flex-direction: column;
            align-items: flex-start;
          }

          .error-message {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
