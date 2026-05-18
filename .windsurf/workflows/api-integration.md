---
description: API Integration Flow with Axios, Error Handling and Notifications
---

# API Integration Workflow

When integrating a new API endpoint in the Next.js + Material UI project, follow this standardized flow.

## 1. Add Service Layer

Create or update service file in `/src/services/[module].service.ts`:

```typescript
import { api } from "./api";

export interface YourEntity {
  id: number;
  // ... other fields
}

export interface YourEntityParams {
  page?: number;
  limit?: number;
  // ... other filters
}

export const yourService = {
  async getEntities(params: YourEntityParams) {
    const { page = 1, limit = 10 } = params;
    return api.get<YourEntity[]>("/your-endpoint", { page, limit });
  },

  async getEntityById(id: number | string) {
    return api.get<YourEntity>(`/your-endpoint/${id}`);
  },

  async createEntity(data: CreateEntityDto) {
    return api.post<YourEntity>("/your-endpoint", data);
  },

  async updateEntity(id: number | string, data: UpdateEntityDto) {
    return api.patch<YourEntity>(`/your-endpoint/${id}`, data);
  },

  async deleteEntity(id: number | string) {
    return api.delete<void>(`/your-endpoint/${id}`);
  },
};

export default yourService;
```

## 2. Use the API Hook in Components

Import and use the notification-aware API hook:

```typescript
"use client";

import { useApi } from "@/hooks/useApi";
import { yourService, YourEntity, PaginatedResponse } from "@/services/your.service";
import { useNotification } from "@/contexts/NotificationContext";

export default function YourPage() {
  const { showSuccess, showInfo } = useNotification();
  const { execute, loading, data, error } = useApi<PaginatedResponse<YourEntity>>();

  const loadData = async () => {
    await execute(
      () => yourService.getEntities({ page: 1, limit: 10 }),
      {
        showErrorNotification: true,  // Shows error in Snackbar automatically
        showSuccessNotification: true, // Optional: shows success message
        successMessage: "Datos cargados exitosamente",
        onSuccess: (data) => {
          // Handle success (optional)
          console.log("Data loaded:", data);
        },
        onError: (error) => {
          // Handle error (optional)
          console.error("Error:", error);
        },
      }
    );
  };

  // Use in JSX with loading state
  return (
    <TableCrud
      loading={loading}
      rows={data?.rows || []}
      // ... other props
    />
  );
}
```

## 3. Show Manual Notifications

For user actions (buttons, form submissions), use the notification hook directly:

```typescript
import { useNotification } from "@/contexts/NotificationContext";

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleAction = () => {
    try {
      // ... perform action
      showSuccess("Acción completada exitosamente");
    } catch (error) {
      showError("Error al realizar la acción");
    }
  };

  return <Button onClick={handleAction}>Acción</Button>;
}
```

## 4. API Client Features (Already Configured)

The API client at `/src/lib/api/client.ts` provides:

- **Automatic error handling**: All errors are caught and formatted consistently
- **Auth token injection**: Bearer token added automatically from localStorage
- **401 redirect**: Automatically redirects to /login on unauthorized
- **Timeout handling**: 30s default timeout
- **Type safety**: Generic types for request/response

### Error Handling Pattern

```typescript
import { getErrorMessage, isApiError } from "@/lib/api/client";

// In catch block
const message = getErrorMessage(error);
// Returns: "Error del servidor" | "Network Error" | etc.
```

## 5. File Structure

```
src/
├── lib/api/
│   └── client.ts          # Axios config, interceptors
├── contexts/
│   └── NotificationContext.tsx  # Snackbar provider
├── hooks/
│   └── useApi.ts          # useApi and useApiCall hooks
├── services/
│   ├── api.ts             # API exports
│   ├── orders.service.ts  # Example: orders API
│   └── [your].service.ts  # New API service
└── app/
    └── [page]/page.tsx    # Uses services + hooks
```

## 6. Key Imports Summary

```typescript
// API calls
import { api } from "@/services/api";
import { yourService } from "@/services/your.service";

// Hooks
import { useApi } from "@/hooks/useApi";
import { useNotification } from "@/contexts/NotificationContext";

// Error handling
import { getErrorMessage, isApiError } from "@/lib/api/client";
```

## 7. Testing the API

When backend is not ready, use mock data with toggle:

```typescript
const [useMockData, setUseMockData] = useState(true);

const loadData = async () => {
  if (useMockData) {
    // Use mock data
    return mockData;
  }

  // Try API
  const result = await execute(() => yourService.getData());
  if (result) {
    setUseMockData(false);
  }
};
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

**Rule**: Always use this pattern for API integrations to ensure consistent error handling, loading states, and user notifications.
