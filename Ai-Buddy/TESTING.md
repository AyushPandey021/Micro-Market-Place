# AI Buddy Service - Testing Guide

## Quick Start

### 1. Install Dependencies

```bash
cd Ai-Buddy
npm install
```

### 2. Configure Environment

The `.env` file is already configured with default values for testing.

### 3. Run All Tests

```bash
npm test
```

## Testing Different Scenarios

### Scenario 1: NLP Query Parsing

Test the natural language parsing engine:

```bash
npm test -- --testNamePattern="NLP"
```

**What it tests:**

- Query tokenization
- Filter extraction (price, color, category)
- Confidence scoring
- Search query building

**Sample Queries to Test Manually:**

```
POST /ai-buddy/parse
{
  "query": "Find me red sneakers under ₹2000"
}
```

Expected parsed filters:

```json
{
  "keywords": ["sneak"],
  "color": "red",
  "category": "shoe",
  "maxPrice": 2000,
  "confidence": 0.95
}
```

### Scenario 2: Authentication & Authorization

Test JWT token verification:

```bash
npm test -- --testNamePattern="Authentication"
```

**What it tests:**

- Token validation
- Authorization checks
- Error handling for invalid tokens

### Scenario 3: Input Validation

Test request validation:

```bash
npm test -- --testNamePattern="Validation"
```

**What it tests:**

- Query length validation
- Required field validation
- Data type validation
- Array/Object structure validation

### Scenario 4: Integration Tests

Test complete workflows:

```bash
npm test -- --testNamePattern="Integration"
```

**What it tests:**

- Full ask buddy workflow
- Product search with cart integration
- Error handling across services
- Service fallback mechanisms

## Manual Testing with cURL

### Test 1: Health Check

```bash
curl http://localhost:5005/health
```

### Test 2: Parse Query (No Auth Required)

```bash
curl -X POST http://localhost:5005/ai-buddy/parse \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Find me red sneakers under ₹2000"
  }'
```

Expected Response:

```json
{
  "success": true,
  "query": "Find me red sneakers under ₹2000",
  "filters": {
    "keywords": ["sneak"],
    "color": "red",
    "maxPrice": 2000,
    "category": "shoe",
    "confidence": 0.95
  }
}
```

### Test 3: Ask Buddy (With Auth)

First, generate a token:

```bash
TOKEN=$(node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({userId: 'test-user', email: 'test@example.com'}, 'your_jwt_secret_key_change_in_production'))")
```

Then make the request:

```bash
curl -X POST http://localhost:5005/ai-buddy/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "Find me black shoes under ₹3000",
    "autoAddToCart": false
  }'
```

### Test 4: Search Products

```bash
curl -X POST http://localhost:5005/ai-buddy/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "blue formal shirt"
  }'
```

### Test 5: Add to Cart

```bash
curl -X POST http://localhost:5005/ai-buddy/cart/add-single \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "prod-123",
    "quantity": 2
  }'
```

### Test 6: Get Cart

```bash
curl http://localhost:5005/ai-buddy/cart \
  -H "Authorization: Bearer $TOKEN"
```

## Test Coverage Analysis

Run tests with coverage report:

```bash
npm run test:coverage
```

This generates a coverage report showing:

- **Statements**: % of code executed
- **Branches**: % of conditional branches executed
- **Functions**: % of functions executed
- **Lines**: % of lines executed

**Current Coverage Target**: 50% minimum for each metric

## Debugging Tests

### Enable Verbose Output

```bash
npm test -- --verbose
```

### Run Single Test File

```bash
npm test -- __tests__/aibuddy.test.js
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="parse"
```

### Watch Mode (Re-run on Changes)

```bash
npm run test:watch
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

## Test Data Examples

### Query Examples

1. Simple search: "shoes"
2. Color + category: "red sneakers"
3. Color + price: "black shoes under 2000"
4. Category + price: "shirts below 500"
5. All filters: "blue formal pants under ₹1500"
6. Price range: "watches between 5000 and 15000"
7. Ambiguous query: "xyz abc qwerty" (should fail validation)

### Expected Parse Results

**Query**: "Find me red sneakers under ₹2000"

```json
{
  "keywords": ["sneak"],
  "color": "red",
  "category": "shoe",
  "maxPrice": 2000,
  "confidence": 0.95
}
```

**Query**: "Black formal shirt"

```json
{
  "keywords": ["formal", "shirt"],
  "color": "black",
  "category": "shirt",
  "confidence": 0.7
}
```

**Query**: "Cheap bags"

```json
{
  "keywords": ["cheap", "bag"],
  "category": "bag",
  "confidence": 0.4
}
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench (if not installed)
# Ubuntu: sudo apt-get install apache2-utils
# macOS: brew install httpd

# Run 100 requests with 10 concurrent connections
ab -n 100 -c 10 http://localhost:5005/health
```

### Memory Usage Monitoring

```bash
# Run service in monitor mode
node --max-old-space-size=256 server.js

# Check memory in another terminal
ps aux | grep node
```

## Troubleshooting

### Issue: Tests Timeout

**Solution**: Increase timeout in jest.setup.js

```javascript
jest.setTimeout(20000); // 20 seconds
```

### Issue: Port Already in Use

**Solution**: Change PORT in .env

```env
PORT=5006
```

### Issue: JWT Verification Fails

**Solution**: Ensure JWT_SECRET matches in .env and test setup

```env
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### Issue: Service Not Found Errors

**Solution**: Mock external services in tests (already done in jest.setup.js)

### Issue: NLP Parsing Not Working

**Solution**: Check NODE_ENV is not set to production

```bash
export NODE_ENV=development
npm test
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: AI Buddy Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Test Reporting

Generate HTML test report:

```bash
npm test -- --coverage --coverageReporters=html
# Open coverage/index.html in browser
```

## Pre-commit Hooks

Set up husky for pre-commit testing:

```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm test"
```

Now tests run automatically before each commit.

## Success Criteria

✅ All 28+ tests pass
✅ Code coverage ≥ 50%
✅ No linting errors
✅ Response time < 200ms (excluding external service calls)
✅ NLP confidence > 0.6 for valid queries
✅ JWT validation working
✅ Input validation catching invalid requests
✅ Error messages clear and helpful

## Next Steps

1. Start the service: `npm run dev`
2. Run tests: `npm test`
3. Check coverage: `npm run test:coverage`
4. Make requests: `curl http://localhost:5005/health`
5. Monitor logs: Check console output for debug info

Happy testing! 🚀
