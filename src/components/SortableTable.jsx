import React, { useState } from 'react';

export default function SortableTable({ data = [], title = '', columns = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!data || data.length === 0) {
    return null;
  }

  const tableColumns = columns.length > 0 ? columns : Object.keys(data[0]);
  
  // Sort data
  let sortedData = [...data];
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle numeric values
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <span className="sort-icon">⇅</span>;
    }
    return (
      <span className="sort-icon active">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="sortable-table-container">
      {title && (
        <div className="table-header-section">
          <h3 className="table-title">{title}</h3>
          <span className="row-count-badge">{data.length} rows</span>
        </div>
      )}
      <div className="table-wrapper">
        <table className="sortable-table">
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th key={column} onClick={() => handleSort(column)} className="sortable-header">
                  <span className="header-content">
                    {column}
                    <SortIcon column={column} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                {tableColumns.map((column) => (
                  <td key={column}>
                    {String(row[column] || '').substring(0, 100)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .sortable-table-container {
          margin: 24px 0;
          width: 100%;
        }

        .table-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .table-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .row-count-badge {
          display: inline-block;
          background-color: #2563EB;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .table-wrapper {
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .sortable-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .sortable-table thead tr {
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .sortable-header {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }

        .sortable-header:hover {
          background-color: #f3f4f6;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sort-icon {
          font-size: 12px;
          color: #9ca3af;
          opacity: 0.5;
        }

        .sort-icon.active {
          color: #2563EB;
          opacity: 1;
          font-weight: bold;
        }

        .sortable-table tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.15s ease;
        }

        .sortable-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .sortable-table tbody tr.even-row {
          background-color: #ffffff;
        }

        .sortable-table tbody tr.odd-row {
          background-color: #f9fafb;
        }

        .sortable-table td {
          padding: 12px 16px;
          color: #1f2937;
          word-break: break-word;
        }

        @media (max-width: 768px) {
          .sortable-table {
            font-size: 12px;
          }

          .sortable-table td,
          .sortable-header {
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
}
