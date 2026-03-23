import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUploadZone from '../components/FileUploadZone';
import SortableTable from '../components/SortableTable';
import ProgressBar from '../components/ProgressBar';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

// Google Maps API Configuration
const GOOGLE_MAPS_API_KEY = 'AIzaSyD-LDsruG-ypdfgdgdfgdpb_AyQn18Vw7FZL4xxuBkU';

export default function ToolB() {
  const [payrollFile, setPayrollFile] = useState(null);
  const [mileageFile, setMileageFile] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('calculate');
  const [error, setError] = useState(null);
  const [mileageSummary, setMileageSummary] = useState(null);
  const [rawMileageData, setRawMileageData] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState(null);

  const readWorkbook = (file, onSuccess, errorPrefix) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          if (jsonData.length === 0) {
            throw new Error('File is empty');
          }

          onSuccess(jsonData);
          setError(null);
        } catch (err) {
          setError(`${errorPrefix}: ${err.message}`);
        }
      };
      reader.onerror = () => setError(`${errorPrefix}: failed to read file`);
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(`${errorPrefix}: ${err.message}`);
    }
  };

  const handlePayrollFile = (file) => {
    if (!file) return;
    readWorkbook(file, setPayrollFile, 'Error reading payroll file');
  };

  const handleMileageFile = (file) => {
    if (!file) return;
    readWorkbook(file, setMileageFile, 'Error reading mileage file');
  };

  const calculatePayrollAndMileage = async () => {
    if (!payrollFile || !mileageFile) {
      setError('Please upload both payroll and mileage files');
      return;
    }

    try {
      setCalculating(true);
      setProgress(0);
      setError(null);

      const progressSteps = [15, 35, 60, 80, 100];
      let stepIndex = 0;

      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setProgress(progressSteps[stepIndex]);
          stepIndex += 1;
        } else {
          clearInterval(progressInterval);
        }
      }, 500);

      await new Promise((resolve) => setTimeout(resolve, 2500));

      const merged = payrollFile.map((payroll) => {
        const mileage = mileageFile.find(
          (item) =>
            (item['Employee ID'] || item.ID) === (payroll['Employee ID'] || payroll.ID) &&
            (item.Date || item.date) === (payroll.Date || payroll.date)
        );

        return {
          ...payroll,
          Mileage: mileage ? mileage.Mileage || mileage.Miles || 0 : 0,
        };
      });

      const summary = {};
      merged.forEach((record) => {
        const employeeId = record['Employee ID'] || record.ID || 'Unknown';
        const hours = Number(record.Hours || record.Qty || 0);
        const miles = Number(record.Mileage || 0);
        const hourlyRate = Number(record['Hourly Rate'] || 0);

        if (!summary[employeeId]) {
          summary[employeeId] = {
            'Employee ID': employeeId,
            'Employee Name': record['Employee Name'] || record.Name || 'Unknown',
            'Total Hours': 0,
            'Total Mileage': 0,
            'Hourly Rate': hourlyRate,
            'Mileage Rate': 0.58,
          };
        }

        summary[employeeId]['Total Hours'] += hours;
        summary[employeeId]['Total Mileage'] += miles;

        if (!summary[employeeId]['Hourly Rate'] && hourlyRate) {
          summary[employeeId]['Hourly Rate'] = hourlyRate;
        }
      });

      const summaryArray = Object.values(summary).map((employee) => ({
        ...employee,
        'Gross Pay':
          employee['Total Hours'] * employee['Hourly Rate'] +
          employee['Total Mileage'] * employee['Mileage Rate'],
      }));

      setMileageSummary(summaryArray);
      setRawMileageData(merged.slice(0, 50));
      setEmployeeSummary(summaryArray);
      setResults(merged);
      setProgress(100);

      clearInterval(progressInterval);
      setCalculating(false);
    } catch (err) {
      setError(`Error during calculation: ${err.message}`);
      setCalculating(false);
      setProgress(0);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    try {
      const worksheet = XLSX.utils.json_to_sheet(results);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
      XLSX.writeFile(workbook, 'payroll_mileage_results.xlsx');
    } catch (err) {
      setError(`Error downloading file: ${err.message}`);
    }
  };

  return (
    <div className="tool-container">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <div className="tool-header">
        <h1>Payroll & Mileage Calculator</h1>
      </div>

      <div className="tool-content">
        <div className="tab-nav">
          <button
            className={`tab-button ${activeTab === 'calculate' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculate')}
          >
            Calculate
          </button>
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Mileage Summary
          </button>
          <button
            className={`tab-button ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Data
          </button>
          <button
            className={`tab-button ${activeTab === 'employee' ? 'active' : ''}`}
            onClick={() => setActiveTab('employee')}
          >
            Employee Summary
          </button>
        </div>

        {activeTab === 'calculate' && (
          <div className="tab-content">
            <div className="two-column-layout">
              <div className="column">
                <div className="section">
                  <h3 className="section-title">Payroll Data</h3>
                  <FileUploadZone onFileSelect={handlePayrollFile} />
                  {payrollFile && <p className="message success">Payroll data loaded</p>}
                </div>
              </div>

              <div className="column">
                <div className="section">
                  <h3 className="section-title">Mileage Data</h3>
                  <FileUploadZone onFileSelect={handleMileageFile} />
                  {mileageFile && <p className="message success">Mileage data loaded</p>}
                </div>
              </div>
            </div>

            {calculating && (
              <div className="progress-section">
                <ProgressBar progress={progress} />
              </div>
            )}

            <div className="button-section">
              <button
                className="calculate-button"
                onClick={calculatePayrollAndMileage}
                disabled={!payrollFile || !mileageFile || calculating}
              >
                {calculating ? 'Calculating...' : 'Calculate Payroll & Mileage'}
              </button>
            </div>

            {results && (
              <div className="result-section">
                <div className="result-message success-message">
                  Calculation complete! {results.length} records processed
                </div>
                <div className="download-section">
                  <button className="download-button" onClick={downloadResults}>
                    Download Results
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="tab-content">
            {!mileageSummary ? (
              <EmptyState
                title="No Summary Yet"
                message="Run Calculate Payroll first to generate mileage summary"
              />
            ) : (
              <SortableTable data={mileageSummary} columns={Object.keys(mileageSummary[0])} />
            )}
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="tab-content">
            {!rawMileageData ? (
              <EmptyState
                title="No Raw Data Yet"
                message="Run Calculate Payroll first to generate raw mileage data"
              />
            ) : (
              <SortableTable data={rawMileageData} columns={Object.keys(rawMileageData[0])} />
            )}
          </div>
        )}

        {activeTab === 'employee' && (
          <div className="tab-content">
            {!employeeSummary ? (
              <EmptyState
                title="No Employee Summary Yet"
                message="Run Calculate Payroll first to generate employee summary"
              />
            ) : (
              <SortableTable data={employeeSummary} columns={Object.keys(employeeSummary[0])} />
            )}
          </div>
        )}
      </div>

      <style>{`
        .tool-container {
          width: 100%;
          min-height: 100vh;
          padding: 32px 24px;
          background-color: #f9fafb;
        }

        .tool-header {
          margin-bottom: 32px;
        }

        .tool-header h1 {
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin: 0;
        }

        .tool-content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .tab-nav {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          overflow-x: auto;
        }

        .tab-button {
          flex: 1;
          padding: 16px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          white-space: nowrap;
        }

        .tab-button:hover {
          color: #374151;
          background-color: #ffffff;
        }

        .tab-button.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          background-color: #ffffff;
        }

        .tab-content {
          padding: 24px;
        }

        .two-column-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 24px;
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
          color: #1a1a1a;
          margin: 0;
        }

        .message {
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .message.success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
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

        .calculate-button:hover:not(:disabled),
        .download-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .calculate-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .progress-section {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .result-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .result-message {
          padding: 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .success-message {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .download-section {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .tool-container {
            padding: 16px;
          }

          .tool-header h1 {
            font-size: 22px;
          }

          .two-column-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .tab-button {
            flex-shrink: 0;
            min-width: 150px;
          }

          .tab-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
