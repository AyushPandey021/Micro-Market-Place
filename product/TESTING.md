# Product Service - Jest Test Setup

This document provides instructions on how to run and maintain tests for the Product Service API, specifically for the POST `/api/products/` endpoint with image upload using Multer and ImageKit.

## Project Structure

```
product/
├── __tests__/
│   ├── fixtures/
│   │   └── test-image.jpg           # Test image file
│   └── product.post.test.js         # Test suite for POST endpoint
├── src/
│   ├── controllers/
│   │   └── productController.js     # Product upload controller
│   ├── routes/
│   │   └── product.routes.js        # Product routes with multer
│   ├── config/
│   │   └── db.js                   # Database configuration
│   └── app.js                       # Express app setup
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Jest setup file
├── server.js                        # Server entry point
├── package.json                     # Dependencies and scripts
└── .env                            # Environment variables
```

## Setup Instructions

### 1. Environment Variables

Update your `.env` file with ImageKit credentials:

```env
MONGO_URI="mongodb://127.0.0.1:27017/product-service"
JWT_SECRET="your_jwt_secret"
REDIS_HOST="redis-15158.crce300.ap-south-1-2.ec2.cloud.redislabs.com"
REDIS_PORT=15158
REDIS_PASSWORD="RpogsvepOkEv9ppRMZcWnyAfOH3hByd6"
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"
```

### 2. Install Dependencies

All required dependencies have been installed:

- `jest`: Testing framework
- `supertest`: HTTP assertion library
- `multer`: File upload middleware
- `imagekit`: Image upload and management service

```bash
npm install
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

## Test Coverage

The test suite for `POST /api/products/` includes:

### 1. **Successful Product Upload**

- Upload product with image and all fields
- Upload product with minimal required fields

### 2. **Validation Errors**

- Missing name field (400 error)
- Missing price field (400 error)
- Missing image file (400 error)

### 3. **Image Upload Edge Cases**

- Handle different image formats
- Preserve original filename in upload

### 4. **Response Structure**

- Verify all required properties in response
- Verify image metadata is included

## API Endpoint Details

### POST /api/products/

**Description:** Upload a new product with an image

**Request:**

- **Method:** POST
- **URL:** `/api/products/`
- **Content-Type:** multipart/form-data

**Form Fields:**

- `name` (string, required): Product name
- `price` (number, required): Product price
- `description` (string, optional): Product description
- `image` (file, required): Product image file

**Response:**

Success (201):

```json
{
  "success": true,
  "message": "Product uploaded successfully",
  "data": {
    "name": "Product Name",
    "description": "Product Description",
    "price": "99.99",
    "image": {
      "url": "https://ik.imagekit.io/products/image.jpg",
      "fileId": "imagekit-file-id"
    }
  }
}
```

Error (400):

```json
{
  "success": false,
  "message": "Name and price are required"
}
```

Error (500):

```json
{
  "success": false,
  "message": "Error uploading product",
  "error": "Error details"
}
```

## Testing with cURL

```bash
# Example: Upload a product with image
curl -X POST http://localhost:3000/api/products/ \
  -F "name=Awesome Product" \
  -F "price=99.99" \
  -F "description=An awesome product description" \
  -F "image=@/path/to/image.jpg"
```

## Mocking ImageKit in Tests

The test suite mocks ImageKit responses to avoid actual API calls during testing. The mock returns:

- `url`: `https://ik.imagekit.io/products/test-image.jpg`
- `fileId`: `mock-file-id-123`

To adjust mock behavior, update the mock in `__tests__/product.post.test.js`:

```javascript
jest.mock("imagekit", () => {
  return jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockResolvedValue({
      url: "https://ik.imagekit.io/products/test-image.jpg",
      fileId: "mock-file-id-123",
    }),
  }));
});
```

## Multer Configuration

Multer is configured with the following settings:

- **Storage:** Memory storage (file stored in RAM during processing)
- **File Size Limit:** 10MB
- **Field Name:** `image`

To modify these settings, update `src/routes/product.routes.js`:

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
```

## Development Workflow

1. **Start the server in development mode:**

   ```bash
   npm run dev
   ```

2. **Run tests during development:**

   ```bash
   npm run test:watch
   ```

3. **Check test coverage:**
   ```bash
   npm run test:coverage
   ```

## Troubleshooting

### ImageKit Upload Fails

- Verify ImageKit credentials in `.env`
- Check network connectivity to ImageKit API
- Ensure file size is within limits

### Multer Errors

- Check file format is supported
- Verify file size doesn't exceed 10MB limit
- Ensure form field name is exactly `image`

### Test Failures

- Ensure test image exists at `__tests__/fixtures/test-image.jpg`
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`
- Check MongoDB connection (tests run in isolation but may still connect)

## Future Enhancements

- [ ] Add product schema validation
- [ ] Implement product database storage
- [ ] Add authentication/authorization checks
- [ ] Add rate limiting
- [ ] Add image optimization
- [ ] Add additional file format validation
- [ ] Implement product retrieval endpoints
