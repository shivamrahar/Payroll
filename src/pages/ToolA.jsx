import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUploadZone from '../components/FileUploadZone';
import SortableTable from '../components/SortableTable';
import ErrorBanner from '../components/ErrorBanner';

export default function ToolA() {
  const [payrollData, setPayrollData] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [mergedData, setMergedData] = useState(null);
  const [missingAddresses, setMissingAddresses] = useState([]);
  const [payrollMessage, setPayrollMessage] = useState('');
  const [scheduleMessage, setScheduleMessage] = useState('');
  const [mergeMessage, setMergeMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Payroll Report upload
  const handlePayrollUpload = (file) => {
    if (!file) return;
    setErrorMessage('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);

          if (data.length === 0) {
            throw new Error('File is empty');
          }

          setPayrollData(data);
          setPayrollMessage(`✅ Successfully loaded ${data.length} payroll records`);
        } catch (error) {
          setErrorMessage(`Error reading payroll file: ${error.message}`);
          setPayrollData(null);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read file');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Handle Schedule Report upload
  const handleScheduleUpload = (file) => {
    if (!file) return;
    setErrorMessage('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(worksheet);

          if (rawData.length === 0) {
            throw new Error('File is empty');
          }

          // Transform data
          const transformedData = rawData.map((row) => {
            const patientAddress = [
              row.Address,
              row.City,
              row.State,
              row.ZIP
            ]
              .filter(Boolean)
              .join(' ');

            const patientFirst = row.PatientFirst || '';
            const patientLast = row.PatientLast || '';
            const patientName = patientLast && patientFirst 
              ? `${toTitleCase(patientLast)}, ${toTitleCase(patientFirst)}`
              : '';

            return {
              ...row,
              "Patient's Address": patientAddress,
              "Patient Name": patientName,
            };
          });

          setScheduleData(transformedData);
          setScheduleMessage(`✅ Successfully loaded ${transformedData.length} schedule records`);
        } catch (error) {
          setErrorMessage(`Error reading schedule file: ${error.message}`);
          setScheduleData(null);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read file');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Helper function for title casing
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Merge datasets
  const handleCalculate = () => {
    setMergeMessage('');
    setMissingAddresses([]);
    setMergedData(null);
    setErrorMessage('');

    try {
      if (!payrollData || !scheduleData) {
        setErrorMessage('Please upload both files first.');
        return;
      }

      // Create a lookup from schedule data
      const scheduleLookup = {};
      scheduleData.forEach((row) => {
        const patientName = row['Patient Name'];
        const visitDate = row['Visit Date'];
        const address = row["Patient's Address"];

        if (patientName && visitDate) {
          const key = `${patientName}||${visitDate}`;
          scheduleLookup[key] = address;
        }
      });

      // Left join: merge address onto payroll
      const result = payrollData.map((row) => {
        const patientName = row['Patient Name'];
        const visitDate = row['Visit Date'];
        const key = patientName && visitDate ? `${patientName}||${visitDate}` : null;

        return {
          ...row,
          "Patient's Address": key && scheduleLookup[key] ? scheduleLookup[key] : '',
        };
      });

      // Check for missing addresses
      const missing = result.filter((row) => !row["Patient's Address"]);

      if (missing.length > 0) {
        setMissingAddresses(missing);
        setMergeMessage(
          `⚠️ Found ${missing.length} rows with missing addresses. Please review or fill missing addresses.`
        );
      } else {
        setMergedData(result);
        setMergeMessage('✅ All addresses matched successfully!');
      }
    } catch (error) {
      setErrorMessage(`Calculation error: ${error.message}`);
    }
  };

  // Download merged data as Excel
  const handleDownload = () => {
    if (!mergedData) return;

    try {
      const worksheet = XLSX.utils.json_to_sheet(mergedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll');
      XLSX.writeFile(workbook, 'Payroll_With_Address.xlsx');
    } catch (error) {
      setErrorMessage(`Download error: ${error.message}`);
    }
  };

  return (
    <div className="tool-container">
      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage('')} />

      <div className="tool-header">
        <h1>Calculate Patient Addresses</h1>
        <p className="tool-subtitle">Merge payroll and schedule data to add patient addresses</p>
      </div>

      <div className="tool-content">
        <div className="two-column-layout">
          {/* LEFT COLUMN */}
          <div className="column">
            <div className="section">
              <h2 className="section-title">Payroll Report</h2>
              <FileUploadZone onFileSelect={handlePayrollUpload} accept=".csv,.xlsx,.xls" />
              {payrollMessage && (
                <div className={`message ${payrollData ? 'success' : 'error'}`}>
                  {payrollMessage}
                </div>
              )}
              {payrollData && (
                <div className="preview-section">
                  <SortableTable 
                    data={payrollData.slice(0, 5)} 
                    title={`Preview (First 5 of ${payrollData.length})`}
                    columns={Object.keys(payrollData[0]).slice(0, 4)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="column">
            <div className="section">
              <h2 className="section-title">Schedule Report</h2>
              <FileUploadZone onFileSelect={handleScheduleUpload} accept=".csv,.xlsx,.xls" />
              {scheduleMessage && (
                <div className={`message ${scheduleData ? 'success' : 'error'}`}>
                  {scheduleMessage}
                </div>
              )}
              {scheduleData && (
                <div className="preview-section">
                  <SortableTable 
                    data={scheduleData.slice(0, 5)} 
                    title={`Preview (First 5 of ${scheduleData.length})`}
                    columns={Object.keys(scheduleData[0]).slice(0, 4)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CALCULATE BUTTON */}
        {payrollData && scheduleData && (
          <div className="button-section">
            <button onClick={handleCalculate} className="calculate-button">
              ✓ Calculate Payroll Address
            </button>
          </div>
        )}

        {/* MERGE RESULT */}
        {mergeMessage && (
          <div className="merge-result-section">
            <div
              className={`merge-message ${
                mergedData ? 'success-message' : 'warning-message'
              }`}
            >
              {mergeMessage}
            </div>

            {/* Missing Addresses Table */}
            {missingAddresses.length > 0 && (
              <div className="missing-section">
                <SortableTable 
                  data={missingAddresses}
                  title={`Rows with Missing Addresses (${missingAddresses.length})`}
                  columns={Object.keys(missingAddresses[0]).slice(0, 6)}
                />
              </div>
            )}

            {/* Download Button */}
            {mergedData && (
              <div className="download-section">
                <button onClick={handleDownload} className="download-button">
                  ⬇ Download Excel File
                </button>
                <span className="download-hint">{mergedData.length} rows ready to download</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .tool-container {
          width: 100%;
          min-height: 100vh;
          padding: 32px 24px;
        }

        .tool-header {
          margin-bottom: 32px;
        }

        .tool-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .tool-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }

        .tool-content {
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #f3f4f6;
        }

        .two-column-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }

        .column {
          display: flex;
          flex-direction: column;
        }

        .section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          padding-bottom: 0;
        }

        .message {
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border-left: 4px solid;
        }

        .message.success {
          background-color: #dcfce7;
          color: #166534;
          border-left-color: #22c55e;
        }

        .message.error {
          background-color: #fee2e2;
          color: #991b1b;
          border-left-color: #ef4444;
        }

        .preview-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .button-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .calculate-button,
        .download-button {
          padding: 12px 32px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .calculate-button:hover,
        .download-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .calculate-button:active,
        .download-button:active {
          transform: translateY(0);
        }

        .merge-result-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .merge-message {
          padding: 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          border-left: 4px solid;
        }

        .success-message {
          background-color: #dcfce7;
          color: #166534;
          border-left-color: #22c55e;
        }

        .warning-message {
          background-color: #fef3c7;
          color: #92400e;
          border-left-color: #f59e0b;
        }

        .missing-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .download-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background-color: #f0f9ff;
          border-radius: 6px;
          border: 1px solid #bfdbfe;
        }

        .download-hint {
          font-size: 12px;
          color: #0c4a6e;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .tool-container {
            padding: 16px 16px;
          }

          .tool-content {
            padding: 16px;
          }

          .two-column-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .tool-header h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
