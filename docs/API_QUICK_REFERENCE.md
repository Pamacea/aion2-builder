# AION2Builder API - Quick Reference Card

Quick reference for the AION2Builder REST API v1.

## Base URL

```
Development: http://localhost:3000/api/v1
Production:  https://aion2builder.com/api/v1
```

## Authentication

```bash
# Cookie-based session authentication
Cookie: next-auth.session-token=<your-token>
```

## Endpoints

### Builds

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/builds` | ❌ | List builds (filtering, pagination) |
| POST | `/builds` | ✅ | Create new build |
| GET | `/builds/{id}` | ❌* | Get build details |
| PUT | `/builds/{id}` | ✅† | Update build |
| DELETE | `/builds/{id}` | ✅† | Delete build |
| POST | `/builds/{id}/like` | ✅ | Toggle like |
| PUT | `/builds/{id}/daevanion` | ✅† | Update daevanion |

* Public builds only, private require auth
† Owner or admin only

## Query Parameters

### List Builds (`GET /builds`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `classId` | integer | - | Filter by class ID |
| `userId` | string | - | Filter by user ID |
| `private` | boolean | - | Filter by visibility |
| `limit` | integer | 20 | Items per page (1-100) |
| `offset` | integer | 0 | Items to skip |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 42  // Only for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Quick Examples

### List Builds
```bash
curl "http://localhost:3000/api/v1/builds?limit=20"
```

### Get Build
```bash
curl "http://localhost:3000/api/v1/builds/123"
```

### Create Build
```bash
curl -X POST "http://localhost:3000/api/v1/builds" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=TOKEN" \
  -d '{
    "name": "My Build",
    "classId": 1,
    "private": false
  }'
```

### Update Build
```bash
curl -X PUT "http://localhost:3000/api/v1/builds/123" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=TOKEN" \
  -d '{
    "name": "Updated Name"
  }'
```

### Delete Build
```bash
curl -X DELETE "http://localhost:3000/api/v1/builds/123" \
  -H "Cookie: next-auth.session-token=TOKEN"
```

### Toggle Like
```bash
curl -X POST "http://localhost:3000/api/v1/builds/123/like" \
  -H "Cookie: next-auth.session-token=TOKEN"
```

### Update Daevanion
```bash
curl -X PUT "http://localhost:3000/api/v1/builds/123/daevanion" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=TOKEN" \
  -d '{
    "nezekan": [1, 2, 3, 4],
    "zikel": [5, 6, 7, 8],
    "vaizel": [9, 10],
    "triniel": [11, 12, 13],
    "ariel": [14, 15],
    "azphel": [16, 17, 18, 19]
  }'
```

## Data Models

### Build Object
```typescript
{
  id: number;
  name: string;
  classId: number;
  userId: string | null;  // null for starter builds
  baseSP: number;         // default: 231
  extraSP: number;        // default: 0
  baseSTP: number;        // default: 40
  extraSTP: number;       // default: 0
  shortcuts?: Record<string, {
    type: "ability" | "stigma";
    abilityId?: number;
    stigmaId?: number;
  }>;
  shortcutLabels?: Record<string, string>;
  private: boolean;       // default: true
  createdAt: string;
  updatedAt: string;
  class: Class;
  user?: User;
  abilities?: BuildAbility[];
  passives?: BuildPassive[];
  stigmas?: BuildStigma[];
  daevanion?: BuildDaevanion;
  likes?: Like[];
  _count?: { likes: number };
}
```

### Create Build Input
```typescript
{
  name: string;           // required
  classId: number;        // required
  baseSP?: number;        // default: 231
  extraSP?: number;       // default: 0
  baseSTP?: number;       // default: 40
  extraSTP?: number;      // default: 0
  private?: boolean;      // default: true
  abilities?: Array<{
    abilityId: number;
    level: number;        // 1-20
    activeSpecialtyChoiceIds?: number[];
    selectedChainSkillIds?: number[];
  }>;
  passives?: Array<{
    passiveId: number;
    level: number;        // 1-20
  }>;
  stigmas?: Array<{
    stigmaId: number;
    level: number;        // 1-20
    stigmaCost: number;
    activeSpecialtyChoiceIds?: number[];
    selectedChainSkillIds?: number[];
  }>;
  shortcuts?: Record<string, {
    type: "ability" | "stigma";
    abilityId?: number;
    stigmaId?: number;
  }>;
  shortcutLabels?: Record<string, string>;
}
```

### Daevanion Input
```typescript
{
  nezekan: number[];      // Defense path
  zikel: number[];        // Offense path
  vaizel: number[];       // Utility path
  triniel: number[];      // Critical path
  ariel: number[];        // Healing path
  azphel: number[];       // Burst damage path
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| `name` | 1-255 characters |
| `classId` | Valid class ID |
| `abilityId` | Must exist in DB |
| `level` | 1-20 |
| `stigmaCost` | Positive integer |
| `limit` | 1-100 |
| `offset` | >= 0 |

## Class IDs

| ID | Class |
|----|-------|
| 1 | Gladiator |
| 2 | Templar |
| 3 | Ranger |
| 4 | Assassin |
| 5 | Sorcerer |
| 6 | Spiritmaster |
| 7 | Cleric |
| 8 | Chanter |
| 9 | Gunner |
| 10 | Songweaver |
| 11 | Aethertech |
| 12 | Painter |

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "You must be authenticated" | Missing/invalid session | Sign in with Discord |
| "Build not found" | Invalid build ID | Check ID, verify access |
| "You don't have permission" | Not build owner | Check ownership |
| "Validation error: ..." | Invalid input | Check request body |
| "Resource not found" | Related entity missing | Verify foreign keys |

## TypeScript Types

```typescript
import type {
  Build,
  BuildCreateInput,
  BuildUpdateInput,
  DaevanionInput,
  ApiResponse,
  ApiResponseSuccess,
  ApiResponseError
} from '@/types/api.schema';
```

## cURL with Session Cookie

```bash
# Get session token from browser DevTools
# Application → Cookies → next-auth.session-token

# Use in requests
curl "http://localhost:3000/api/v1/builds" \
  -H "Cookie: next-auth.session-token=eyJhbGc..."
```

## JavaScript Fetch Examples

```typescript
// List builds
const response = await fetch('/api/v1/builds?classId=1&limit=20');
const { data, count } = await response.json();

// Create build
const build = await fetch('/api/v1/builds', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',  // Send cookies
  body: JSON.stringify({
    name: 'My Build',
    classId: 1
  })
}).then(r => r.json());

// Update build
const updated = await fetch(`/api/v1/builds/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ name: 'New Name' })
}).then(r => r.json());

// Delete build
await fetch(`/api/v1/builds/${id}`, {
  method: 'DELETE',
  credentials: 'include'
});
```

## Axios Examples

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true  // Send cookies
});

// List builds
const { data } = await api.get('/builds', {
  params: { classId: 1, limit: 20 }
});

// Create build
const { data: build } = await api.post('/builds', {
  name: 'My Build',
  classId: 1
});

// Update build
const { data: updated } = await api.put(`/builds/${id}`, {
  name: 'Updated Name'
});

// Delete build
await api.delete(`/builds/${id}`);
```

## React Query Examples

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// List builds
const { data: builds } = useQuery({
  queryKey: ['builds', { classId: 1 }],
  queryFn: () => fetch(`/api/v1/builds?classId=1`)
    .then(r => r.json())
    .then(d => d.data)
});

// Create build
const queryClient = useQueryClient();
const createBuild = useMutation({
  mutationFn: (data) => fetch('/api/v1/builds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  onSuccess: () => {
    queryClient.invalidateQueries(['builds']);
  }
});

// Update build
const updateBuild = useMutation({
  mutationFn: ({ id, data }) => fetch(`/api/v1/builds/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json())
});
```

## Testing

```bash
# List builds (no auth)
curl http://localhost:3000/api/v1/builds

# Get build (no auth if public)
curl http://localhost:3000/api/v1/builds/1

# Create build (requires auth)
curl -X POST http://localhost:3000/api/v1/builds \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=TOKEN" \
  -d '{"name":"Test","classId":1}'

# Expect error without auth
curl -X POST http://localhost:3000/api/v1/builds \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","classId":1}'
# Returns: {"success":false,"error":"You must be authenticated"}
```

## Pagination Pattern

```typescript
async function getAllBuilds() {
  const builds = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `/api/v1/builds?limit=${limit}&offset=${offset}`
    );
    const { data, count } = await response.json();

    builds.push(...data);

    if (data.length < limit) break;

    offset += limit;
  }

  return builds;
}
```

## Error Handling Pattern

```typescript
async function apiCall(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data;
}

// Usage
try {
  const build = await apiCall('/api/v1/builds/123');
  console.log(build);
} catch (error) {
  console.error('API Error:', error.message);
}
```

## Full Documentation

- **Complete API Spec**: `docs/openapi.yaml`
- **Developer Guide**: `docs/API_OPENAPI_GUIDE.md`
- **Swagger UI Setup**: `docs/API_SWAGGER_UI_SETUP.md`
- **This Quick Reference**: `docs/API_QUICK_REFERENCE.md`

## Support

- GitHub Issues: [github.com/yourusername/aion2builder/issues](https://github.com/yourusername/aion2builder/issues)
- OpenAPI Spec: `docs/openapi.yaml`
- Type Definitions: `src/types/api.schema.ts`

---

**Version**: 1.0.0
**Last Updated**: 2026-01-07
