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

-| Load | Samples | Avg Response Time (ms) | Min (ms) | Max (ms) | Error % | Throughput (req/sec) |
|------|---------|------------------------|----------|----------|---------|----------------------|
| 100  | 300     | 135.00                 | 59       | 366      | 12.00%  | 10.00                |
| 200  | 600     | 145.00                 | 56       | 480      | 13.00%  | 19.80                |
| 300  | 900     | 1,480.00               | 56       | 17,988   | 16.56%  | 24.30                |
| 400  | 1,200   | 4,361.00               | 58       | 75,260   | 22.33%  | 14.70                |
| 500  | 1,500   | 6,176.00               | 50       | 59,421   | 27.20%  | 16.90                |

**Analysis:**
- Error rate reduced to 12–27% after fixing token extraction and dynamic dates
- Remaining errors are HTTP 400 responses: “Property is not available for the selected dates”
- Root cause: only **three** seed properties are available, so concurrent 4-night bookings eventually collide even with staggered dates
- Response time remains excellent for successful requests

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
- 100 users: ~135ms (when successful)
- 200 users: ~145ms (7% increase)
- 300 users: ~1,480ms (920% increase)
- 400 users: ~4,361ms (195% increase)
- 500 users: ~6,176ms (42% increase)

## Key Findings

### Strengths
1. **Property Fetching API** - Best performance, 0% errors
2. **Low Load Performance** - All APIs perform well at 100-200 users
3. **Throughput Scaling** - Throughput increases linearly with load

### Bottlenecks Identified
1. **Authentication API** - Significant degradation at 300+ users
   - Possible causes: Database connection pool, JWT generation overhead
2. **Booking API** - Errors now stem from limited data (not auth failures)
   - 12–27% of requests overlap with existing bookings because only 3 properties exist
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

4. **Expand Booking Test Data**
   - Seed additional properties or reset bookings between runs
   - Continue using the improved Groovy processors for tokens/dates

## Next Steps

1. **View HTML Reports**: Open `jmeter-results/*-report/index.html` for detailed charts
2. **Create Performance Graph**: Plot response time vs. load for all 3 scenarios
3. **Write Analysis**: Document bottlenecks and recommendations
4. **Fix Booking Tests**: Investigate and resolve 33% error rate

## Files Generated

- **CSV Summary**: `jmeter-results-summary.csv`
- **HTML Reports**: `jmeter-results/*-report/index.html`
- **Raw Data**: `jmeter-results/*.jtl`

