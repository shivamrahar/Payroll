import React from 'react';

export default function EmptyState({
  title = 'No data available',
  message = 'No data available',
}) {
  return (
    <div className="empty-state">
      <svg className="empty-state-icon" viewBox="0 0 120 120" fill="none" stroke="currentColor">
        {/* Chart outline */}
        <rect x="15" y="25" width="90" height="65" rx="4" strokeWidth="2" />
        
        {/* Bars */}
        <rect x="25" y="65" width="12" height="20" fill="none" strokeWidth="2" rx="1" />
        <rect x="45" y="55" width="12" height="30" fill="none" strokeWidth="2" rx="1" />
        <rect x="65" y="50" width="12" height="35" fill="none" strokeWidth="2" rx="1" />
        <rect x="85" y="60" width="12" height="25" fill="none" strokeWidth="2" rx="1" />
        
        {/* Dashed bottom line */}
        <line x1="20" y1="89" x2="105" y2="89" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
      <p className="empty-state-message">{title}</p>
      <p className="empty-state-hint">No data to display yet. Complete the calculations above to see results here.</p>
      {message !== title && <p className="empty-state-detail">{message}</p>}

      <style>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 80px 24px 60px;
          color: #9ca3af;
        }

        .empty-state-icon {
          width: 100px;
          height: 100px;
          color: #d1d5db;
          opacity: 0.6;
        }

        .empty-state-message {
          font-size: 16px;
          font-weight: 500;
          color: #6b7280;
          text-align: center;
          margin: 0;
          max-width: 380px;
        }

        .empty-state-hint {
          font-size: 13px;
          color: #9ca3af;
          text-align: center;
          margin: 0;
          max-width: 380px;
          line-height: 1.5;
        }

        .empty-state-detail {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin: 0;
          max-width: 420px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .empty-state {
            padding: 60px 20px 40px;
          }

          .empty-state-icon {
            width: 80px;
            height: 80px;
          }

          .empty-state-message {
            font-size: 15px;
          }

          .empty-state-hint {
            font-size: 12px;
          }

          .empty-state-detail {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
