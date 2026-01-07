# Swagger UI Integration Guide

Optional enhancement to add interactive API documentation to your AION2Builder application.

## Overview

Swagger UI provides an interactive web interface to explore and test your API directly in the browser.

## Preview

Users will be able to:
- Browse all API endpoints with descriptions
- View request/response schemas
- Test API calls directly from the browser
- Download client SDKs
- View authentication information

## Installation

### Step 1: Install Dependencies

```bash
npm install swagger-ui-react swagger-ui-dist
```

### Step 2: Create API Documentation Page

Create `src/app/docs/api/page.tsx`:

```typescript
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-dist/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AION2Builder API Documentation
          </h1>
          <p className="text-gray-600">
            Interactive REST API documentation powered by OpenAPI 3.0
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <SwaggerUI
            url="/api/v1/openapi.yaml"
            docExpansion="list"
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            tryItOutEnabled={true}
            persistAuthorization={true}
            displayRequestDuration={true}
            displayOperationId={false}
            filter={true}
            showRequestHeaders={true}
            syntaxHighlight={{
              activate: true,
              theme: "monokai"
            }}
            supportedSubmitMethods={[
              "get",
              "post",
              "put",
              "delete",
              "patch"
            ]}
            validatorUrl={null}
            withCredentials={true}
            requestInterceptor={(request) => {
              // Automatically inject session cookie if available
              if (typeof window !== "undefined") {
                const cookies = document.cookie.split(";");
                const sessionCookie = cookies.find(cookie =>
                  cookie.trim().startsWith("next-auth.session-token=")
                );

                if (sessionCookie) {
                  request.headers["Cookie"] = sessionCookie.trim();
                }
              }
              return request;
            }}
            responseInterceptor={(response) => {
              return response;
            }}
          />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-blue-800 text-sm">
            Some endpoints require authentication. Sign in with Discord to test
            authenticated endpoints. Your session will be automatically used.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Serve OpenAPI Specification

Create `src/app/api/v1/openapi.yaml/route.ts`:

```typescript
import { NextResponse } from "next/server";
import openapiSpec from "@/../../docs/openapi.yaml";

export async function GET() {
  // Read the OpenAPI spec file
  const fs = await import("fs/promises");
  const path = await import("path");

  const specPath = path.join(process.cwd(), "docs", "openapi.yaml");
  const spec = await fs.readFile(specPath, "utf-8");

  return new NextResponse(spec, {
    headers: {
      "Content-Type": "application/yaml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
```

### Step 4: Add Navigation Link (Optional)

Add a link to your navigation menu:

```typescript
// In your navigation component
<Link href="/docs/api" className="text-gray-700 hover:text-gray-900">
  API Docs
</Link>
```

### Step 5: Custom Styling (Optional)

Create `src/app/docs/api/globals.css`:

```css
/* Override Swagger UI styles for AION2Builder branding */

.swagger-ui {
  font-family: system-ui, -apple-system, sans-serif;
}

.swagger-ui .topbar {
  background-color: #1f2937; /* Gray-900 */
}

.swagger-ui .topbar-wrapper .link {
  display: none; /* Hide default Swagger logo */
}

.swagger-ui .info {
  margin: 20px 0;
}

.swagger-ui .info .title {
  color: #1f2937;
  font-size: 28px;
}

.swagger-ui .opblock.opblock-get {
  border-color: #3b82f6; /* Blue for GET */
}

.swagger-ui .opblock.opblock-post {
  border-color: #10b981; /* Green for POST */
}

.swagger-ui .opblock.opblock-put {
  border-color: #f59e0b; /* Amber for PUT */
}

.swagger-ui .opblock.opblock-delete {
  border-color: #ef4444; /* Red for DELETE */
}

.swagger-ui .btn.authorize {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.swagger-ui .btn.authorize:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}
```

Import it in the page:

```typescript
import "./globals.css";
```

## Usage

### Accessing the Documentation

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to:
   - Local: `http://localhost:3000/docs/api`
   - Production: `https://yourdomain.com/docs/api`

### Testing the API

1. **For public endpoints** (no auth required):
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - View response

2. **For authenticated endpoints**:
   - First, sign in via `http://localhost:3000/api/auth/signin/discord`
   - Return to API docs
   - The session cookie will be automatically used
   - Click "Try it out" and execute

### Authentication Flow

The Swagger UI page automatically extracts your session cookie and includes it with requests.

If you see "401 Unauthorized" errors:
1. Sign in via Discord: `/api/auth/signin/discord`
2. Refresh the API docs page
3. Try again

## Customization

### Custom Branding

```typescript
<SwaggerUI
  // ... other props
  spec={{
    ...openapiSpec,
    info: {
      ...openapiSpec.info,
      title: "Your Custom API Title",
      description: "Custom description",
      contact: {
        name: "Your Support",
        url: "https://yourdomain.com/support",
        email: "support@yourdomain.com"
      }
    }
  }}
/>
```

### Custom Plugins

Add custom Swagger UI plugins:

```typescript
const CustomPlugin = () => {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          selectInfoDefinition: (ori, system) => (state) => {
            // Custom logic
            return ori(state);
          }
        }
      }
    }
  };
};

<SwaggerUI
  plugins={[CustomPlugin]}
  // ... other props
/>
```

## Alternative: Redoc

If you prefer a more documentation-focused UI (instead of interactive), use Redoc:

### Installation

```bash
npm install redoc
```

### Create Redoc Page

```typescript
// src/app/docs/api/redoc/page.tsx
"use client";

import { useEffect } from "react";

export default function RedocPage() {
  useEffect(() => {
    import("redoc").then((Redoc) => {
      Redoc.default(
        "/api/v1/openapi.yaml",
        document.getElementById="redoc-container"),
        {
          theme: {
            colors: {
              primary: {
                main: "#3b82f6"
              }
            }
          }
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div id="redoc-container" />
    </div>
  );
}
```

## Production Considerations

### 1. Environment-Specific URLs

Update the `servers` section in `docs/openapi.yaml` for production:

```yaml
servers:
  - url: https://yourdomain.com/api/v1
    description: Production
  - url: http://localhost:3000/api/v1
    description: Local Development
```

### 2. Access Control (Optional)

If you want to restrict API documentation access:

```typescript
// src/app/docs/api/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ApiDocsPage() {
  const session = await auth();

  // Require authentication to view docs
  if (!session) {
    redirect("/api/auth/signin");
  }

  return <SwaggerUIContent />;
}
```

### 3. Analytics

Add analytics to track API documentation usage:

```typescript
useEffect(() => {
  // Track page view
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_title: "API Documentation",
      page_path: "/docs/api"
    });
  }
}, []);
```

## Benefits of Swagger UI Integration

1. **Interactive Testing**: Test API calls directly from documentation
2. **Better Developer Experience**: Self-documenting API
3. **Reduced Support**: Developers can explore API themselves
4. **Client SDK Generation**: Built-in support for generating clients
5. **Type Safety**: Import schemas into frontend code
6. **Versioning**: Track API changes across versions
7. **Team Collaboration**: Share API documentation with team

## Troubleshooting

### Issue: OpenAPI spec not loading

**Solution**: Verify the API route is working:

```bash
curl http://localhost:3000/api/v1/openapi.yaml
```

Should return the YAML content.

### Issue: CORS errors when testing

**Solution**: Ensure CORS headers are set:

```typescript
// In src/app/api/v1/openapi.yaml/route.ts
return new NextResponse(spec, {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
});
```

### Issue: Session cookie not being sent

**Solution**: Verify the `requestInterceptor` is correctly extracting cookies:

```typescript
requestInterceptor={(request) => {
  console.log("Cookies:", document.cookie); // Debug
  return request;
}}
```

## Next Steps

1. Install the dependencies
2. Create the documentation page
3. Test locally
4. Customize styling to match your brand
5. Deploy to production
6. Share with your team/community

## Additional Resources

- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Redoc Documentation](https://github.com/Redocly/redoc)
- [swagger-ui-react Props](https://github.com/swagger-api/swagger-ui/tree/master/packages/swagger-ui-react#props)

---

**Status**: Optional Enhancement
**Installation Time**: ~15 minutes
**Difficulty**: Easy
**Last Updated**: 2026-01-07
