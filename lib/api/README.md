# API Client

This directory contains the API client configuration and utilities for making HTTP requests to the backend API.

## Structure

```
lib/api/
├── client.ts          # Axios instance with interceptors
├── errorHandler.ts    # Error handling utilities
├── types.ts          # TypeScript types for API responses
├── index.ts          # Module exports
└── README.md         # This file
```

## Usage

### Basic API Call

```typescript
import { apiClient } from "@/lib/api";

// GET request
const response = await apiClient.get("/rooms");
const rooms = response.data;

// POST request
const newRoom = await apiClient.post("/rooms", {
  roomNumber: "101",
  floor: 1,
  price: 1000000,
  facilities: ["AC", "WiFi"],
  status: "AVAILABLE",
});

// PATCH request
const updated = await apiClient.patch("/rooms/123", {
  status: "OCCUPIED",
});

// DELETE request
await apiClient.delete("/rooms/123");
```

### Error Handling

```typescript
import { apiClient, handleApiError } from "@/lib/api";

try {
  const response = await apiClient.get("/rooms");
  return response.data;
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error(errorMessage);
  // Show error to user (toast, alert, etc.)
}
```

### Using TypeScript Types

```typescript
import { apiClient, Room, ApiResponse } from "@/lib/api";

async function getRooms(): Promise<Room[]> {
  const response = await apiClient.get<ApiResponse<Room[]>>("/rooms");
  return response.data.data;
}

async function getRoom(id: string): Promise<Room> {
  const response = await apiClient.get<ApiResponse<Room>>(`/rooms/${id}`);
  return response.data.data;
}
```

### Validation Error Handling

```typescript
import { apiClient, extractValidationErrors } from "@/lib/api";

try {
  await apiClient.post("/rooms", roomData);
} catch (error) {
  const validationErrors = extractValidationErrors(error);

  if (validationErrors) {
    // Handle field-specific errors
    // { roomNumber: 'Room number is required', price: 'Price must be positive' }
    Object.entries(validationErrors).forEach(([field, message]) => {
      console.error(`${field}: ${message}`);
    });
  }
}
```

## Features

### Request Interceptor

- Automatically adds JWT token from localStorage to all requests
- Sets `Authorization: Bearer <token>` header

### Response Interceptor

- Handles common HTTP error codes (401, 403, 404, 500)
- Automatically redirects to login on 401 Unauthorized
- Logs errors to console for debugging

### Error Handler

- Converts API errors to user-friendly messages
- Supports validation error extraction
- Detects network errors and authentication errors

### TypeScript Types

- Complete type definitions for all API entities
- Enums for status values
- Generic response wrappers
- Paginated response support

## Configuration

Set the API base URL in your environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Default: `http://localhost:3000/api`

## Authentication

The API client automatically handles authentication:

1. Token is stored in localStorage after login
2. Request interceptor adds token to all requests
3. Response interceptor handles 401 errors by:
   - Clearing localStorage
   - Redirecting to login page

## Next Steps

Create API service modules for each entity:

```typescript
// lib/api/services/rooms.ts
import { apiClient, Room, ApiResponse } from "@/lib/api";

export const roomsApi = {
  getAll: () => apiClient.get<ApiResponse<Room[]>>("/rooms"),
  getById: (id: string) => apiClient.get<ApiResponse<Room>>(`/rooms/${id}`),
  create: (data: Partial<Room>) =>
    apiClient.post<ApiResponse<Room>>("/rooms", data),
  update: (id: string, data: Partial<Room>) =>
    apiClient.patch<ApiResponse<Room>>(`/rooms/${id}`, data),
  delete: (id: string) => apiClient.delete(`/rooms/${id}`),
};
```
