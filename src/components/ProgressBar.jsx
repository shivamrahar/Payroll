import React, { useEffect, useState } from 'react';

export default function ProgressBar({ progress = 0, isVisible = true }) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth animation of progress
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  // Determine which step is active based on progress
  const getStepStatus = (stepProgress) => {
    if (displayProgress >= stepProgress) return 'completed';
    if (displayProgress >= stepProgress - 20) return 'active';
    return 'pending';
  };

  const steps = [
    { label: 'Reading files...', progress: 15 },
    { label: 'Applying policies...', progress: 35 },
    { label: 'Calculating mileage...', progress: 60 },
    { label: 'Building summary...', progress: 80 },
    { label: 'Done!', progress: 100 },
  ];

  if (!isVisible) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ 
            width: `${displayProgress}%`,
            transition: 'width 0.3s ease-out'
          }}
        ></div>
      </div>
      
      <div className="progress-percent">
        {Math.round(displayProgress)}%
      </div>

      <div className="progress-steps">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`progress-step ${getStepStatus(step.progress)}`}
          >
            <div className="step-dot">
              {getStepStatus(step.progress) === 'completed' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="checkmark">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        .progress-bar-container {
          margin: 24px 0;
          width: 100%;
        }

        .progress-bar-track {
          position: relative;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563EB 0%, #1d4ed8 100%);
          border-radius: 4px;
          box-shadow: 0 0 4px rgba(37, 99, 235, 0.5);
        }

        .progress-percent {
          text-align: right;
          font-size: 12px;
          font-weight: 600;
          color: #2563EB;
          margin-bottom: 16px;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 100px;
        }

        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
          border: 2px solid #e5e7eb;
        }

        .progress-step.active .step-dot {
          background-color: #2563EB;
          border-color: #2563EB;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .progress-step.completed .step-dot {
          background-color: #2563EB;
          border-color: #2563EB;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          color: white;
        }

        .step-label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          text-align: center;
          transition: color 0.3s ease;
        }

        .progress-step.active .step-label {
          color: #2563EB;
          font-weight: 600;
        }

        .progress-step.completed .step-label {
          color: #059669;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
          }
          50% {
            box-shadow: 0 0 16px rgba(37, 99, 235, 0.6);
          }
        }

        @media (max-width: 768px) {
          .progress-steps {
            gap: 4px;
          }

          .progress-step {
            min-width: 80px;
          }

          .step-label {
            font-size: 11px;
          }

          .step-dot {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}
