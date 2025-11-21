# JMeter Performance Testing Results

This directory contains the final results and deliverables for JMeter performance testing of the Airbnb Prototype application.

## Directory Structure

```
JMeter-Tests/
├── README.md                          # This file
├── airbnb-performance-test-complete.jmx # Comprehensive test plan (all 15 scenarios)
├── jmeter-test-plans/                 # Individual test plan files (.jmx)
│   ├── auth-100users.jmx
│   ├── auth-200users.jmx
│   ├── property-100users.jmx
│   ├── booking-100users.jmx
│   └── ... (15 total test plans)
├── jmeter-results/                    # Test execution results
│   ├── *.jtl                          # Raw JMeter results
│   └── *-report/                      # HTML reports with charts
├── jmeter-results-summary.csv         # Summary of all metrics
├── JMETER_FINAL_SUMMARY.md            # Complete results & analysis
├── JMETER_RESULTS_SUMMARY.md          # Results summary (Markdown)
└── JMETER_RESULTS_SUMMARY.pdf         # Results summary (PDF)
```

## View Results

### Summary Data
```bash
# View summary CSV
cat jmeter-results-summary.csv

# View Markdown summary
cat JMETER_RESULTS_SUMMARY.md

# View PDF summary
open JMETER_RESULTS_SUMMARY.pdf
```

### HTML Reports
```bash
# Open any HTML report in browser
open jmeter-results/auth-100users-*-report/index.html
```

### Run Single Test (if needed)
```bash
cd JMeter-Tests
jmeter -n -t jmeter-test-plans/auth-100users.jmx \
  -l jmeter-results/test.jtl \
  -e -o jmeter-results/test-report
```

## Test Results Summary

- **Total Tests**: 15 (3 scenarios × 5 load levels)
- **Test Scenarios**: 
  - Authentication (Login API)
  - Property Fetching (Get Properties API)
  - Booking Creation (Create Booking API)
- **Load Levels**: 100, 200, 300, 400, 500 concurrent users

### Key Results:
- **Authentication**: 0% errors (except 1.2% at 500 users)
- **Property Fetching**: 0% errors, best performance
- **Booking Creation**: 12–27% errors due to limited property availability (dataset bottleneck, not auth)

See `JMETER_FINAL_SUMMARY.md` for complete analysis and bottleneck identification.

## Key Files for Assignment

1. **`airbnb-performance-test-complete.jmx`** - **Single comprehensive test plan file** with all 15 test scenarios (for submission)
2. **`jmeter-results-summary.csv`** - All metrics in CSV format (ready for graphs)
3. **`JMETER_FINAL_SUMMARY.md`** - Complete results, analysis, and recommendations
4. **`JMETER_RESULTS_SUMMARY.md`** - Results summary in Markdown format
5. **`JMETER_RESULTS_SUMMARY.pdf`** - Results summary in PDF format
6. **`jmeter-test-plans/`** - Individual test plan files (.jmx) - 15 separate files
7. **`jmeter-results/*-report/index.html`** - HTML reports with charts (ready for screenshots)

## Assignment Deliverables Checklist

- **JMeter test plan (.jmx file)**: **`airbnb-performance-test-complete.jmx`** (single file with all 15 test scenarios) OR `jmeter-test-plans/*.jmx` (15 individual files)
- **Summary of test results**: `jmeter-results-summary.csv`, `JMETER_RESULTS_SUMMARY.md`, and `JMETER_RESULTS_SUMMARY.pdf`
- **Screenshots of JMeter results**: Open HTML reports in `jmeter-results/*-report/index.html` and take screenshots
- **Analysis of performance bottlenecks**: See `JMETER_FINAL_SUMMARY.md`

## Creating Your Performance Graph

Use the data from `jmeter-results-summary.csv`:

1. **X-axis**: Number of concurrent users (100, 200, 300, 400, 500)
2. **Y-axis**: Average response time (ms)
3. **Three lines**: 
   - Authentication (blue)
   - Property Fetching (green)
   - Booking Creation (orange)
