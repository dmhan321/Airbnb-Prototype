#  JMeter Performance Test Results Summary

## Test Execution Summary

**Total Tests Run:** 16 (includes one duplicate)
**Test Scenarios:** 3 (Authentication, Property Fetching, Booking Creation)
**Load Levels:** 100, 200, 300, 400, 500 concurrent users

## Results Overview

###  Authentication Tests (Login API)

| Load | Samples | Avg Response Time (ms) | Min (ms) | Max (ms) | Error % | Throughput (req/sec) |
|------|---------|----------------------|----------|----------|---------|---------------------|
| 100  | 100     | 209.90               | 196      | 308      | 0.00%   | 3.33                |
| 200  | 200     | 284.88               | 190      | 478      | 0.00%   | 6.67                |
| 300  | 300     | 2,152.72             | 247      | 6,277    | 0.00%   | 10.00               |
| 400  | 400     | 7,525.34             | 251      | 20,911   | 0.00%   | 13.33               |
| 500  | 500     | 14,700.21            | 98       | 35,921   | 1.20%   | 16.67               |

**Analysis:**
- Excellent performance at low loads (100-200 users)
- Response time increases significantly at 300+ users
- Some errors at 500 users (1.2%)
- Throughput scales linearly with load

### Property Fetching Tests (Get Properties API)

| Load | Samples | Avg Response Time (ms) | Min (ms) | Max (ms) | Error % | Throughput (req/sec) |
|------|---------|----------------------|----------|----------|---------|---------------------|
| 100  | 500     | 76.31                | 56       | 226      | 0.00%   | 16.67               |
| 200  | 1,000   | 81.39                | 54       | 417      | 0.00%   | 33.33               |
| 300  | 1,500   | 1,018.29             | 55       | 4,946    | 0.00%   | 50.00               |
| 400  | 2,000   | 1,553.66             | 53       | 6,939    | 0.00%   | 66.67               |
| 500  | 2,500   | 2,314.09             | 55       | 7,945    | 0.00%   | 83.33               |

**Analysis:**
- Excellent performance - fastest API
- 0% errors across all load levels
- Very consistent response times at low loads
- Response time increases at 300+ users but remains acceptable
- Highest throughput (83 req/sec at 500 users)

### Booking Creation Tests (Create Booking API)

| Load | Samples | Avg Response Time (ms) | Min (ms) | Max (ms) | Error % | Throughput (req/sec) |
|------|---------|----------------------|----------|----------|---------|---------------------|
| 100  | 300     | 131.11               | 52       | 1,353    | 33.33%  | 10.00               |
| 200  | 600     | 152.23               | 49       | 796      | 33.33%  | 20.00               |
| 300  | 900     | 533.07               | 48       | 4,669    | 33.33%  | 30.00               |
| 400  | 1,200   | 2,411.77             | 49       | 20,305   | 33.33%  | 40.00               |
| 500  | 1,500   | 4,706.57             | 50       | 60,097   | 35.27%  | 50.00               |

**Analysis:**
- 33-35% error rate (needs investigation)
- Good response times when successful
- Errors likely due to:
  - Token extraction issues
  - Property ID extraction issues
  - Missing properties in database
  - Booking conflicts

## Performance Trends

### Response Time vs. Load

**Authentication:**
- 100 users: ~210ms
- 200 users: ~285ms (36% increase)
- 300 users: ~2,153ms (655% increase)
- 400 users: ~7,525ms (249% increase)
- 500 users: ~14,700ms (95% increase)

**Property Fetching:**
- 100 users: ~76ms
- 200 users: ~81ms (7% increase)
- 300 users: ~1,018ms (1,156% increase)
- 400 users: ~1,554ms (53% increase)
- 500 users: ~2,314ms (49% increase)

**Booking Creation:**
- 100 users: ~131ms (when successful)
- 200 users: ~152ms (16% increase)
- 300 users: ~533ms (251% increase)
- 400 users: ~2,412ms (352% increase)
- 500 users: ~4,707ms (95% increase)

## Key Findings

### Strengths
1. **Property Fetching API** - Best performance, 0% errors
2. **Low Load Performance** - All APIs perform well at 100-200 users
3. **Throughput Scaling** - Throughput increases linearly with load

### Bottlenecks Identified
1. **Authentication API** - Significant degradation at 300+ users
   - Possible causes: Database connection pool, JWT generation overhead
2. **Booking API** - High error rate (33-35%)
   - Needs investigation: Token/property ID extraction, database constraints
3. **Response Time Spikes** - Max response times are very high at high loads
   - Possible causes: Resource contention, database locks, network latency

### Recommendations
1. **Database Optimization**
   - Increase connection pool size
   - Add database indexes
   - Optimize queries

2. **Caching**
   - Cache property data
   - Cache authentication tokens

3. **Load Balancing**
   - Already using Kubernetes with 2 replicas
   - Consider increasing replicas at high loads

4. **Fix Booking Tests**
   - Investigate token extraction
   - Ensure properties exist in database
   - Fix property ID extraction regex

## Next Steps

1. **View HTML Reports**: Open `jmeter-results/*-report/index.html` for detailed charts
2. **Create Performance Graph**: Plot response time vs. load for all 3 scenarios
3. **Write Analysis**: Document bottlenecks and recommendations
4. **Fix Booking Tests**: Investigate and resolve 33% error rate

## Files Generated

- **CSV Summary**: `jmeter-results-summary.csv`
- **HTML Reports**: `jmeter-results/*-report/index.html`
- **Raw Data**: `jmeter-results/*.jtl`

