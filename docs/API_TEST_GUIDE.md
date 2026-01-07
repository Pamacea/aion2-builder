# API Testing Guide

## Quick Test Commands

### 1. Test GET /api/v1/builds (List builds)
```bash
# Get all public builds (default limit: 20)
curl "http://localhost:3000/api/v1/builds"

# Get builds with pagination
curl "http://localhost:3000/api/v1/builds?limit=5&offset=0"

# Filter by class
curl "http://localhost:3000/api/v1/builds?classId=1"

# Filter by user
curl "http://localhost:3000/api/v1/builds?userId=<user-id>"

# Filter by privacy
curl "http://localhost:3000/api/v1/builds?private=false"
```

### 2. Test GET /api/v1/builds/{id} (Get single build)
```bash
# Get build with ID 1
curl "http://localhost:3000/api/v1/builds/1"

# Get build with ID 5
curl "http://localhost:3000/api/v1/builds/5"
```

### 3. Test POST /api/v1/builds (Create build)
Note: Requires authentication via session cookie.

```bash
# First, sign in via the web interface to get a session cookie
# Then use the cookie to create a build

curl -X POST "http://localhost:3000/api/v1/builds" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Build",
    "classId": 1,
    "private": true
  }' \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

### 4. Test PUT /api/v1/builds/{id} (Update build)
Note: Requires authentication and ownership.

```bash
curl -X PUT "http://localhost:3000/api/v1/builds/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Build Name",
    "private": false
  }' \
  --cookie cookies.txt
```

### 5. Test DELETE /api/v1/builds/{id} (Delete build)
Note: Requires authentication and ownership.

```bash
curl -X DELETE "http://localhost:3000/api/v1/builds/1" \
  --cookie cookies.txt
```

### 6. Test POST /api/v1/builds/{id}/like (Toggle like)
Note: Requires authentication.

```bash
curl -X POST "http://localhost:3000/api/v1/builds/1/like" \
  --cookie cookies.txt
```

### 7. Test PUT /api/v1/builds/{id}/daevanion (Update daevanion)
Note: Requires authentication and ownership.

```bash
curl -X PUT "http://localhost:3000/api/v1/builds/1/daevanion" \
  -H "Content-Type: application/json" \
  -d '{
    "nezekan": [1, 2, 3],
    "zikel": [4, 5, 6],
    "vaizel": [7, 8, 9],
    "triniel": [10, 11, 12],
    "ariel": [13, 14, 15],
    "azphel": [16, 17, 18]
  }' \
  --cookie cookies.txt
```

## Expected Responses

### Success Response Example
```json
{
  "success": true,
  "data": { ... },
  "count": 42
}
```

### Error Response Example
```json
{
  "success": false,
  "error": "Error message here"
}
```

## HTTP Status Codes

- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authorization failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing in Development

1. Start the development server:
```bash
pnpm dev
```

2. Open a new terminal and run the test commands

3. Check the server console for any errors

## Testing with Postman

You can also use Postman or similar tools:

1. Import the API endpoints
2. Set the base URL to `http://localhost:3000/api/v1`
3. For authenticated requests, you'll need to copy the session cookie from your browser
4. Add the cookie to the Postman request headers

## Files Created Summary

```
src/
├── types/
│   └── api.schema.ts                    # Zod validation schemas
├── lib/
│   └── api-utils.ts                     # API helper functions
└── app/
    └── api/
        └── v1/
            └── builds/
                ├── route.ts             # GET (list), POST (create)
                └── [id]/
                    ├── route.ts         # GET, PUT, DELETE
                    ├── like/
                    │   └── route.ts     # POST (toggle like)
                    └── daevanion/
                        └── route.ts     # PUT (update daevanion)
```

## Next Steps

1. Start the dev server and test the endpoints
2. Integrate the API with frontend components
3. Add rate limiting if needed
4. Add API versioning documentation
5. Consider adding OpenAPI/Swagger documentation
