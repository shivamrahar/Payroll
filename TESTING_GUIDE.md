# Payroll Calculator - Testing Guide

## Overview
This document provides sample data and instructions for testing the Payroll & Mileage Calculator application.

---

## Application Features

### Tool A: Patient Address Calculator
**Purpose:** Merges payroll data with schedule data to identify missing patient addresses.

**How to Test:**
1. Login with: `demo@carebridge.com` / `password123`
2. Click "Calculate Patient Addresses"
3. Upload payroll file (see sample below)
4. Upload schedule file
5. Click "Calculate" to identify missing addresses
6. Results show matching records and address gaps

---

### Tool B: Payroll & Mileage Calculator
**Purpose:** Calculates payroll summaries and mileage reimbursement for employees.

**Tabs Available:**
- **Calculate Tab:** Upload files and run calculation
- **Mileage Summary Tab:** View employee mileage totals
- **Raw Data Tab:** See all calculated records
- **Employee Summary Tab:** Employee-level payroll and mileage breakdown

---

## Sample Test Data

### Payroll Data Sample
Use this data structure for testing Tool A and Tool B:

| Employee ID | Employee Name | Date | Hours | Hourly Rate | Department |
|------------|---------------|------|-------|-----------|-----------|
| EMP001 | John Smith | 2026-03-15 | 8 | 25.00 | Nursing |
| EMP002 | Jane Doe | 2026-03-15 | 8 | 28.50 | Administration |
| EMP003 | Mike Johnson | 2026-03-15 | 6 | 22.00 | Support |
| EMP001 | John Smith | 2026-03-16 | 8 | 25.00 | Nursing |
| EMP002 | Jane Doe | 2026-03-16 | 8 | 28.50 | Administration |
| EMP004 | Sarah Williams | 2026-03-16 | 10 | 26.00 | Nursing |

---

### Mileage Data Sample
Use this structure for testing mileage calculations:

| Employee ID | Employee Name | Date | Mileage | Miles | Destination |
|------------|---------------|------|---------|-------|------------|
| EMP001 | John Smith | 2026-03-15 | 45 | 45 | Patient Visits |
| EMP002 | Jane Doe | 2026-03-15 | 0 | 0 | Office |
| EMP003 | Mike Johnson | 2026-03-15 | 32 | 32 | Field Work |
| EMP001 | John Smith | 2026-03-16 | 52 | 52 | Patient Visits |
| EMP002 | Jane Doe | 2026-03-16 | 15 | 15 | Visit |
| EMP004 | Sarah Williams | 2026-03-16 | 67 | 67 | Patient Visits |

---

### Schedule Data Sample (for Patient Address Calculator)
Use this for Tool A testing:

| Employee ID | Employee Name | Date | Patient Address | Location |
|------------|---------------|------|-----------------|----------|
| EMP001 | John Smith | 2026-03-15 | 123 Main St | New York |
| EMP002 | Jane Doe | 2026-03-15 | 456 Oak Ave | Boston |
| EMP003 | Mike Johnson | 2026-03-15 | | Missing Address |
| EMP001 | John Smith | 2026-03-16 | 789 Elm Rd | New York |
| EMP002 | Jane Doe | 2026-03-16 | 555 Pine Ln | Boston |
| EMP004 | Sarah Williams | 2026-03-16 | 999 Maple Dr | Chicago |

---

## Test Scenarios

### Scenario 1: Basic Mileage Calculation
**Goal:** Verify mileage reimbursement is calculated correctly

**Steps:**
1. Login to the app
2. Go to Tool B (Payroll & Mileage Calculator)
3. Upload the Payroll Data sample
4. Upload the Mileage Data sample
5. Click "Calculate Payroll & Mileage"
6. Check results:
   - EMP001 should show: 97 total miles (45+52)
   - EMP002 should show: 15 total miles (0+15)
   - Mileage reimbursement: miles × $0.58/mile

**Expected Outcome:**
- ✅ Calculation completes without errors
- ✅ Results populate all 4 tabs
- ✅ Download button works

---

### Scenario 2: Empty Tab Handling
**Goal:** Verify empty states display correctly

**Steps:**
1. Don't upload any files
2. Try clicking the Mileage Summary, Raw Data, and Employee Summary tabs
3. Should see "No Summary Yet" message on each

**Expected Outcome:**
- ✅ Empty state messages appear
- ✅ UI remains responsive

---

### Scenario 3: Error Handling
**Goal:** Verify error messages appear correctly

**Steps:**
1. Try clicking "Calculate" without uploading files
2. Should see error: "Please upload both payroll and mileage files"
3. Upload invalid or corrupted Excel file
4. Should see appropriate error message

**Expected Outcome:**
- ✅ Clear error messages displayed
- ✅ Error banner appears at top
- ✅ Auto-dismisses after 6 seconds

---

### Scenario 4: Data Sorting
**Goal:** Verify table sorting functionality

**After calculation:**
1. Go to "Employee Summary" tab
2. Click column headers to sort:
   - Click "Employee ID" to sort by ID
   - Click "Gross Pay" to sort by salary
3. Indicators (↑↓) should show sort direction

**Expected Outcome:**
- ✅ Data sorts correctly (ascending/descending)
- ✅ Sort indicators display properly

---

### Scenario 5: Download Results
**Goal:** Verify Excel export works

**Steps:**
1. Complete a calculation
2. Click "Download Results" button
3. File should save as `payroll_mileage_results.xlsx`
4. Open file and verify data matches displayed results

**Expected Outcome:**
- ✅ File downloads successfully
- ✅ Excel file contains all calculated data
- ✅ Column headers are correct

---

### Scenario 6: Mileage Rate Calculation
**Goal:** Verify mileage reimbursement math

**Sample Calculation:**
- EMP001: 97 miles × $0.58/mile = $56.26
- Hours: 16 × $25.00 = $400.00
- Gross Pay: $400.00 + $56.26 = $456.26

**How to Verify:**
1. Look at Employee Summary tab after calculation
2. Find EMP001's "Gross Pay"
3. Manually verify: (Total Hours × Hourly Rate) + (Total Mileage × 0.58)

**Expected Outcome:**
- ✅ Gross Pay matches expected calculation
- ✅ Decimal values are accurate
- ✅ Edge cases (0 mileage) handled correctly

---

### Scenario 7: Patient Address Calculator (Tool A)
**Goal:** Test address matching and gap detection

**Steps:**
1. Go to Tool A (Patient Address Calculator)
2. Upload payroll data
3. Upload schedule data with missing addresses
4. Click "Calculate"
5. Review which records are missing addresses

**Expected Outcome:**
- ✅ Shows matching records
- ✅ Identifies missing addresses
- ✅ Sortable results table

---

## Performance Metrics

### Expected Performance
| Action | Expected Time |
|--------|--------------|
| Login | < 2 seconds |
| File Upload | < 1 second |
| Calculation (100 records) | < 3 seconds |
| Data Display | Immediate |
| Export to Excel | < 1 second |

---

## Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Mobile Responsiveness
- ✅ Hamburger menu appears on screens < 768px
- ✅ Two-column layout converts to single column
- ✅ Tables remain scrollable on mobile

---

## Data Validation Checklist
- [ ] Payroll file has required columns (Employee ID, Hours, Hourly Rate)
- [ ] Mileage file has required columns (Employee ID, Mileage)
- [ ] No empty cells in critical fields
- [ ] Date format is consistent (YYYY-MM-DD)
- [ ] Numeric values are valid numbers (not text)

---

## Known Limitations
- Maximum 50 rows displayed in Raw Data tab
- Google Maps API requires valid key for distance calculations
- Excel files must be in .xlsx format

---

## Support Contact
For issues or questions, contact: [support email]

---

**Last Updated:** March 23, 2026
**Version:** 1.0
