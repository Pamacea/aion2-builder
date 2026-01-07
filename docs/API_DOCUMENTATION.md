# REST API v1 Documentation

## Overview

The AION2Builder REST API v1 provides endpoints for managing builds, including CRUD operations, likes, and Daevanion configuration.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication via NextAuth session. The API checks for a valid session using the `auth()` function.

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": <any>,
  "count": <number> // Optional, only for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### 1. List Builds

**GET** `/api/v1/builds`

List builds with optional filtering and pagination.

#### Query Parameters
- `classId` (number, optional): Filter by class ID
- `userId` (string, optional): Filter by user ID
- `private` (boolean, optional): Filter by privacy status
- `limit` (number, optional): Number of results to return (default: 20, max: 100)
- `offset` (number, optional): Number of results to skip (default: 0)

#### Example Request
```bash
curl "http://localhost:3000/api/v1/builds?classId=1&limit=10&offset=0"
```

#### Example Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "My Build",
      "classId": 1,
      "userId": "user_123",
      "private": false,
      "baseSP": 231,
      "extraSP": 0,
      "baseSTP": 40,
      "extraSTP": 0,
      "class": { ... },
      "abilities": [ ... ],
      "passives": [ ... ],
      "stigmas": [ ... ]
    }
  ],
  "count": 42
}
```

---

### 2. Create Build

**POST** `/api/v1/builds`

Create a new build. Requires authentication.

#### Request Body
```json
{
  "name": "My New Build",
  "classId": 1,
  "baseSP": 231,
  "extraSP": 0,
  "baseSTP": 40,
  "extraSTP": 0,
  "private": true,
  "abilities": [
    {
      "abilityId": 1,
      "level": 5,
      "activeSpecialtyChoiceIds": [],
      "selectedChainSkillIds": []
    }
  ],
  "passives": [
    {
      "passiveId": 1,
      "level": 10
    }
  ],
  "stigmas": [
    {
      "stigmaId": 1,
      "level": 15,
      "stigmaCost": 10,
      "activeSpecialtyChoiceIds": [],
      "selectedChainSkillIds": []
    }
  ]
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/v1/builds" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Build",
    "classId": 1,
    "private": true
  }'
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "My New Build",
    "classId": 1,
    "userId": "user_123",
    "private": true,
    ...
  }
}
```

---

### 3. Get Single Build

**GET** `/api/v1/builds/{id}`

Get a single build by ID.

#### Path Parameters
- `id` (number): Build ID

#### Example Request
```bash
curl "http://localhost:3000/api/v1/builds/1"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "My Build",
    "classId": 1,
    "userId": "user_123",
    "private": false,
    "baseSP": 231,
    "extraSP": 0,
    "baseSTP": 40,
    "extraSTP": 0,
    "shortcuts": { ... },
    "shortcutLabels": { ... },
    "class": { ... },
    "abilities": [ ... ],
    "passives": [ ... ],
    "stigmas": [ ... ],
    "daevanion": { ... },
    "likes": [ ... ]
  }
}
```

---

### 4. Update Build

**PUT** `/api/v1/builds/{id}`

Update an existing build. Requires authentication and ownership.

#### Path Parameters
- `id` (number): Build ID

#### Request Body
Same as Create Build, but all fields are optional.

#### Example Request
```bash
curl -X PUT "http://localhost:3000/api/v1/builds/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Build Name",
    "private": false
  }'
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Build Name",
    "private": false,
    ...
  }
}
```

---

### 5. Delete Build

**DELETE** `/api/v1/builds/{id}`

Delete a build. Requires authentication and ownership.

#### Path Parameters
- `id` (number): Build ID

#### Example Request
```bash
curl -X DELETE "http://localhost:3000/api/v1/builds/1"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

---

### 6. Toggle Like

**POST** `/api/v1/builds/{id}/like`

Toggle like/unlike on a build. Requires authentication.

#### Path Parameters
- `id` (number): Build ID

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/v1/builds/1/like"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 42
  }
}
```

---

### 7. Update Daevanion

**PUT** `/api/v1/builds/{id}/daevanion`

Update Daevanion configuration for a build. Requires authentication and ownership.

#### Path Parameters
- `id` (number): Build ID

#### Request Body
```json
{
  "nezekan": [1, 2, 3],
  "zikel": [4, 5, 6],
  "vaizel": [7, 8, 9],
  "triniel": [10, 11, 12],
  "ariel": [13, 14, 15],
  "azphel": [16, 17, 18]
}
```

#### Example Request
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
  }'
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "nezekan": [1, 2, 3],
    "zikel": [4, 5, 6],
    "vaizel": [7, 8, 9],
    "triniel": [10, 11, 12],
    "ariel": [13, 14, 15],
    "azphel": [16, 17, 18]
  }
}
```

---

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error, invalid input)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (not authorized to perform action)
- `404`: Not Found
- `500`: Internal Server Error

## Testing with curl

### Test listing builds (no auth required)
```bash
curl "http://localhost:3000/api/v1/builds?limit=5"
```

### Test creating a build (requires auth session cookie)
```bash
curl -X POST "http://localhost:3000/api/v1/builds" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Build",
    "classId": 1,
    "private": true
  }' \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

### Test getting a build
```bash
curl "http://localhost:3000/api/v1/builds/1"
```

## Files Created

1. **API Types & Schemas**: `src/types/api.schema.ts`
   - Zod validation schemas
   - TypeScript types for API requests/responses

2. **API Utilities**: `src/lib/api-utils.ts`
   - Response helpers (`apiSuccess`, `apiError`, `handleApiError`)
   - Validation utilities (`validateRequest`)
   - Auth utilities (`requireAuth`, `requireBuildOwnership`)

3. **API Endpoints**:
   - `src/app/api/v1/builds/route.ts` (GET, POST)
   - `src/app/api/v1/builds/[id]/route.ts` (GET, PUT, DELETE)
   - `src/app/api/v1/builds/[id]/like/route.ts` (POST)
   - `src/app/api/v1/builds/[id]/daevanion/route.ts` (PUT)

## Key Features

- ✅ RESTful design with proper HTTP methods
- ✅ Input validation with Zod schemas
- ✅ Authentication and authorization checks
- ✅ Proper HTTP status codes
- ✅ Consistent error handling
- ✅ Cache invalidation for Next.js
- ✅ TypeScript type safety
- ✅ Selective loading (lightweight includes for listing)
- ✅ Pagination support
- ✅ Filtering by class, user, privacy
