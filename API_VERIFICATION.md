# API Endpoint Verification

This document verifies that all frontend API calls match the OpenAPI specification exactly.

## Base URL
- **Environment Variable**: `NEXT_PUBLIC_API_URL`
- **Default**: `http://localhost:8000/api/v1`

## Authentication Endpoints

### POST /api/v1/auth/register ✓
**Implementation**: `components/auth/register-form.tsx`

**Request Body**:
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "Password123"
}
```

**Response** (201 Created): Returns `UserResponse`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00"
}
```

**Fixed Issues**:
- ✓ Changed field from `name` to `full_name`
- ✓ Added password validation (uppercase + numbers required)
- ✓ Redirects to login after successful registration

### POST /api/v1/auth/login ✓
**Implementation**: `components/auth/login-form.tsx`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response** (200 OK): Returns `TokenResponse`
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

**Fixed Issues**:
- ✓ After login, automatically calls `GET /api/v1/auth/me` to fetch user data
- ✓ Stores both access and refresh tokens
- ✓ Redirects to dashboard on successful login

### POST /api/v1/auth/refresh ✓
**Implementation**: `lib/api.ts` (automatic in response interceptor)

**Request Body**:
```json
{
  "refresh_token": "string"
}
```

**Response** (200 OK): Returns `AccessTokenResponse`
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### GET /api/v1/auth/me ✓
**Implementation**: `lib/auth-context.tsx` (called after login)

**Response** (200 OK): Returns `UserResponse`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00"
}
```

## Document Endpoints

### POST /api/v1/documents ✓
**Implementation**: `lib/documents-context.tsx` → `uploadDocument()`

**Request**: `multipart/form-data`
- **Field**: `file` (File object)

**Response** (201 Created): Returns `DocumentResponse`
```json
{
  "id": "uuid",
  "filename": "processed-name.pdf",
  "original_name": "My Document.pdf",
  "mime_type": "application/pdf",
  "file_size": 1024000,
  "status": "PENDING",
  "error_message": null,
  "chunk_count": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Fixed Issues**:
- ✓ Changed endpoint from `/documents/upload` to `/documents`
- ✓ Returns direct `DocumentResponse` (not wrapped in object)
- ✓ Added all required fields to `Document` interface

### GET /api/v1/documents ✓
**Implementation**: `lib/documents-context.tsx` → `fetchDocuments()`

**Query Parameters**:
- `page`: integer (default: 1, minimum: 1)
- `page_size`: integer (default: 20, min: 1, max: 100)

**Response** (200 OK): Returns `DocumentListResponse`
```json
{
  "items": [
    {
      "id": "uuid",
      "filename": "file.pdf",
      "original_name": "My File.pdf",
      "mime_type": "application/pdf",
      "file_size": 1024000,
      "status": "READY",
      "error_message": null,
      "chunk_count": 15,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 20,
  "has_next": false,
  "has_previous": false
}
```

**Fixed Issues**:
- ✓ Corrected response field from `documents` to `items`
- ✓ Added proper pagination handling
- ✓ Updated query parameters to match spec

### DELETE /api/v1/documents/{document_id} ✓
**Implementation**: `lib/documents-context.tsx` → `deleteDocument(id)`

**Path Parameters**:
- `document_id`: UUID string (required)

**Response** (200 OK): Returns `SuccessResponse`
```json
{
  "success": true
}
```

## Chat Endpoints

### POST /api/v1/chat ✓
**Implementation**: `lib/chat-context.tsx` → `sendMessage()`

**Request Body**:
```json
{
  "message": "Hello, what can you help with?",
  "session_id": "uuid or null"
}
```

**Response** (200 OK): Returns streamed response

**Fixed Issues**:
- ✓ Uses `/chat` endpoint (not `/chat/sessions/{id}/messages`)
- ✓ `session_id` can be null to create new session
- ✓ After sending, fetches updated session data

### GET /api/v1/chat/sessions ✓
**Implementation**: `lib/chat-context.tsx` → `fetchSessions()`

**Query Parameters**:
- `page`: integer (default: 1, minimum: 1)
- `page_size`: integer (default: 20, min: 1, max: 100)

**Response** (200 OK): Returns `SessionListResponse`
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Session Title",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20,
  "has_next": false,
  "has_previous": false
}
```

**Fixed Issues**:
- ✓ Corrected response field from `sessions` to `items`
- ✓ Added proper pagination handling

### GET /api/v1/chat/sessions/{session_id} ✓
**Implementation**: `lib/chat-context.tsx` → `fetchMessages()`

**Path Parameters**:
- `session_id`: UUID string (required)

**Response** (200 OK): Returns `SessionDetailResponse`
```json
{
  "session": {
    "id": "uuid",
    "title": "Session Title",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Hello",
      "citations": null,
      "created_at": 1704067200
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Hi! How can I help?",
      "citations": [
        {
          "chunk_id": "string",
          "document_name": "Document Title",
          "page_number": 5,
          "content_preview": "Excerpt from document..."
        }
      ],
      "created_at": 1704067201
    }
  ]
}
```

**Fixed Issues**:
- ✓ Changed endpoint from `/chat/sessions/{id}/messages` to `/chat/sessions/{id}`
- ✓ Updated `Message` interface to match response
- ✓ Fixed `created_at` to be a Unix timestamp (number)
- ✓ Updated `Citation` interface with correct fields

## Data Type Corrections

### Document Status Enum
Valid values: `PENDING`, `PROCESSING`, `READY`, `FAILED`

### Citation Structure
```typescript
interface Citation {
  chunk_id: string           // Unique chunk identifier
  document_name: string      // Source document name
  page_number?: number       // Page number (optional)
  content_preview: string    // Text preview from source
}
```

### Message Structure
```typescript
interface Message {
  id: string                 // UUID
  role: string              // "user" or "assistant"
  content: string           // Message text
  citations?: Citation[] | null  // Optional citations
  created_at: number        // Unix timestamp (seconds)
}
```

## Environment Setup

Required environment variables in `.env.local` or project settings:

```
NEXT_PUBLIC_API_URL=http://168.144.127.168:8000/api/v1
```

Or use the default: `http://localhost:8000/api/v1`

## Testing Checklist

- [x] POST /documents uses `/documents` not `/documents/upload`
- [x] GET /documents returns `items` not `documents`
- [x] Document fields match all API requirements
- [x] Citation structure has `chunk_id` and `content_preview`
- [x] Message `created_at` is a number (Unix timestamp)
- [x] Chat endpoints use `/chat` and `/chat/sessions/{id}`
- [x] All query parameters properly implemented
- [x] Token refresh works automatically on 401
- [x] API base URL includes `/api/v1`
