# AI Buddy Service - Personal Shopping Assistant

AI Buddy is a microservice that acts as a personal shopping assistant, using natural language processing to understand customer queries and assist with product discovery and cart management.

## Features

- **Natural Language Processing**: Parse customer queries like "Find me red sneakers under ₹2000"
- **Intelligent Product Search**: Extract keywords, categories, colors, and price ranges from natural language
- **Smart Cart Management**: Add products to cart on behalf of users
- **Confidence Scoring**: Validate query quality before processing
- **Real-time Integration**: Seamless integration with Product and Cart services
- **Comprehensive Testing**: Full test coverage with Jest

## Architecture

```
AI Buddy Service
├── NLP Engine (utils/nlp.js)
│   ├── Query Parsing
│   ├── Filter Extraction
│   ├── Search Query Building
│   └── Response Generation
├── Service Integrations
│   ├── Product Service Client
│   ├── Cart Service Client
│   └── Auth Service Client
├── Core Logic (services/aibuddy.service.js)
│   ├── Query Processing
│   ├── Product Search
│   └── Cart Operations
└── API Layer
    ├── Routes
    ├── Controllers
    ├── Middleware
    └── Validation
```

## Technology Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **NLP**: Natural (PorterStemmer for tokenization)
- **Testing**: Jest + Supertest
- **Logging**: Pino
- **HTTP Client**: Axios
- **Authentication**: JWT

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5005
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# API Services (Internal Communication)
PRODUCT_SERVICE_URL=http://localhost:5001
CART_SERVICE_URL=http://localhost:5002
AUTH_SERVICE_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:5173

# Database (if storing chat history)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ai-buddy

# Logging
LOG_LEVEL=debug

# NLP Configuration
NLP_CONFIDENCE_THRESHOLD=0.6
MAX_PRODUCT_SUGGESTIONS=5

# Cache Configuration
CACHE_TTL=300

# Request Timeout (ms)
REQUEST_TIMEOUT=5000
```

## Installation

```bash
# Install dependencies
npm install

# Install nodemon for development
npm install -g nodemon
```

## Running the Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "OK",
  "service": "AI Buddy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Ask AI Buddy (Main Endpoint)

```http
POST /ai-buddy/ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "Find me red sneakers under ₹2000",
  "autoAddToCart": false
}
```

**Query Examples:**

- "Find me red sneakers under ₹2000"
- "Show me blue shirts above ₹500"
- "Black watches under 5000"
- "Red shoes for women"
- "Formal dress pants in large size"

**Response:**

```json
{
  "success": true,
  "message": "I found 12 products matching your criteria (showing top 5). Here are some options: Red Sneaker Pro - ₹1500, Red Canvas Shoes - ₹899, ...",
  "products": [
    {
      "_id": "1",
      "name": "Red Sneaker Pro",
      "price": 1500,
      "category": "shoes",
      "images": []
    }
  ],
  "totalCount": 12,
  "confidence": 0.95,
  "filters": {
    "keywords": ["red", "sneaker"],
    "category": "shoe",
    "maxPrice": 2000,
    "color": "red"
  }
}
```

### Search Products

```http
POST /ai-buddy/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "black shoes under 1000"
}
```

### Add Products to Cart

```http
POST /ai-buddy/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productIds": ["prod-1", "prod-2", "prod-3"],
  "quantities": {
    "prod-1": 1,
    "prod-2": 2
  }
}
```

### Add Single Product to Cart

```http
POST /ai-buddy/cart/add-single
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod-1",
  "quantity": 2
}
```

### Get Cart Status

```http
GET /ai-buddy/cart
Authorization: Bearer <token>
```

### Parse Query (for testing/debugging)

```http
POST /ai-buddy/parse
Content-Type: application/json

{
  "query": "Find me red sneakers under ₹2000"
}
```

**Response:**

```json
{
  "success": true,
  "query": "Find me red sneakers under ₹2000",
  "filters": {
    "keywords": ["red", "sneak"],
    "maxPrice": 2000,
    "minPrice": null,
    "category": "shoe",
    "color": "red",
    "size": null,
    "sortBy": "relevance",
    "confidence": 0.95
  }
}
```

## Query Parsing Examples

### Example 1: Color + Category + Price

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

### Example 2: Color + Price (No Category)

**Query**: "Blue shirt above ₹500"

```json
{
  "keywords": ["shirt"],
  "color": "blue",
  "minPrice": 500,
  "confidence": 0.85
}
```

### Example 3: Simple Search

**Query**: "Watch"

```json
{
  "keywords": ["watch"],
  "confidence": 0.3
}
```

### Example 4: Multiple Filters

**Query**: "Black formal pants under 2000"

```json
{
  "keywords": ["formal", "pant"],
  "color": "black",
  "maxPrice": 2000,
  "confidence": 0.85
}
```

## NLP Engine Details

### Supported Color Keywords

- Basic colors: red, blue, green, yellow, black, white, pink, purple, orange, brown, gray/grey, silver, gold

### Supported Category Keywords

- **Shoes**: shoe, sneaker, boot, sandal
- **Shirts**: shirt, tee, top
- **Pants**: pant, jean, short
- **Watches**: watch, clock
- **Jewelry**: ring, necklace, bracelet, earring
- **Bags**: bag, backpack, suitcase

### Price Extraction Patterns

- "under ₹2000" → maxPrice: 2000
- "above ₹500" → minPrice: 500
- "₹1000 to ₹5000" → minPrice: 1000, maxPrice: 5000
- "below 3000" → maxPrice: 3000
- "max: 2000" → maxPrice: 2000

### Confidence Scoring

- Keywords found: +0.3
- Max price specified: +0.25
- Category identified: +0.25
- Color identified: +0.2
- **Minimum threshold**: 0.6 (configurable via NLP_CONFIDENCE_THRESHOLD)

## Integration with Other Services

### Product Service

- **Endpoint**: GET /products
- **Method**: Queries with filters (keywords, category, price range, color)
- **Response**: Array of matching products with details

### Cart Service

- **Endpoint**: POST /cart/items, GET /cart, PATCH /cart/items/:id
- **Method**: Adds items, fetches cart, updates quantities
- **Response**: Updated cart with totals

### Auth Service

- **Method**: Token verification for all protected endpoints
- **Response**: User context from JWT payload

## Testing

### Test Coverage Areas

1. **Health Checks**: Service status verification
2. **NLP Parsing**: Query parsing and filter extraction
3. **Authentication**: Token validation and authorization
4. **Validation**: Input validation for all endpoints
5. **Error Handling**: Graceful error responses
6. **Integration**: Complete workflows with mocked services
7. **Confidence Scoring**: NLP quality assessment
8. **Response Generation**: Natural language output

### Running Specific Tests

```bash
# Test NLP parsing
npm test -- --testNamePattern="NLP"

# Test authentication
npm test -- --testNamePattern="Authentication"

# Test API endpoints
npm test -- --testNamePattern="Endpoint"

# Test integration
npm test -- --testNamePattern="Integration"
```

### Sample Test Output

```
PASS  __tests__/aibuddy.test.js
  AI Buddy Service
    Health Check
      ✓ should return health status (45ms)
    Root Endpoint
      ✓ should return service information (32ms)
    NLP Query Parsing
      ✓ should parse "Find me red sneakers under ₹2000" (12ms)
      ✓ should parse "blue shirt above ₹500" (8ms)
      ✓ should extract category from query (6ms)
      ✓ should handle empty query (4ms)
    Authentication
      ✓ should reject requests without token (25ms)
      ✓ should accept requests with valid token (38ms)
    Validation
      ✓ should validate query on POST /ai-buddy/ask (20ms)
    ... (more tests)

Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
```

## Error Handling

### Common Error Responses

**Authentication Error (401)**

```json
{
  "success": false,
  "message": "No token provided"
}
```

**Validation Error (400)**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "param": "query",
      "msg": "Query must be between 3 and 500 characters"
    }
  ]
}
```

**Service Error (500)**

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details in development mode"
}
```

**Service Unavailable (503)**

```json
{
  "success": false,
  "message": "Product service is unavailable",
  "error": "Connection refused"
}
```

## Performance Optimization

1. **Request Timeout**: Configurable via REQUEST_TIMEOUT (default: 5000ms)
2. **Max Suggestions**: Limit results via MAX_PRODUCT_SUGGESTIONS (default: 5)
3. **Confidence Threshold**: Skip low-quality queries via NLP_CONFIDENCE_THRESHOLD (default: 0.6)
4. **Response Caching**: Can be implemented at API gateway level
5. **Logging**: Adjustable via LOG_LEVEL (debug, info, warn, error)

## Roadmap

- [ ] Chat history storage (MongoDB)
- [ ] User preference learning
- [ ] Multi-language support
- [ ] Advanced NLP models (spaCy, transformers)
- [ ] Real-time notifications
- [ ] Personalized recommendations
- [ ] Analytics and insights
- [ ] A/B testing for query effectiveness

## Contributing

1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Commit with clear messages
5. Submit pull request

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue in the repository.
