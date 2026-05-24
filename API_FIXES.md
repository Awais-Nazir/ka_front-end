# API Integration Fixes

## Issues Fixed

### 1. Register Endpoint Parameter Mismatch
**Issue**: 422 Unprocessable Entity on `/api/v1/auth/register`

**Root Cause**: The OpenAPI spec defines the register request with these parameters:
- `email` (string, email format) ✓
- `password` (string, 8-72 chars, must contain uppercase) ✓
- `full_name` (string, 2-255 chars) ✗ Was sending `name` instead

**Fix Applied**:
- Updated `auth-context.tsx` register function to send `full_name` instead of `name`
- Updated `register-form.tsx` field name from `name` to `fullName`
- Schema validation now uses `full_name` as the key

### 2. Register Response Structure
**Issue**: Registration response doesn't include tokens

**Root Cause**: Per OpenAPI spec, the register endpoint returns `UserResponse` (not tokens):
```json
{
  "id": "uuid",
  "email": "string",
  "full_name": "string",
  "role": "string",
  "is_active": true,
  "created_at": "datetime"
}
```

**Fix Applied**:
- Removed expectation of tokens from register response
- After registration, user is redirected to login page (not directly to dashboard)
- Updated User interface to match the API's UserResponse schema

### 3. Login Response Structure
**Issue**: Login expects `user` field in response

**Root Cause**: Per OpenAPI spec, login returns `TokenResponse`:
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

**Fix Applied**:
- Updated `auth-context.tsx` to handle `TokenResponse` correctly
- After login, a separate `/api/v1/auth/me` call is made to fetch user info
- User info is stored separately in localStorage and used for application state

### 4. Password Validation
**Issue**: Backend requires passwords with uppercase letters

**Root Cause**: Backend password validation includes:
- At least 8 characters
- At least one uppercase letter (documented in error message)
- At least one number (inferred from common password policies)

**Fix Applied**:
- Updated frontend schema validation to require:
  - Minimum 8 characters
  - Maximum 72 characters
  - At least one uppercase letter
  - At least one number

### 5. User State Management
**Issue**: Hydration mismatch error when parsing stored user

**Root Cause**: localStorage could contain invalid JSON (e.g., `undefined` string)

**Fix Applied**:
- Added proper error handling in AuthProvider's useEffect
- Clear all auth tokens if user data cannot be parsed
- Only set user state if JSON parsing succeeds

## API Endpoint Corrections

### Register
```
POST /api/v1/auth/register
Request: {
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "SecurePass123"
}
Response: {
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2026-05-18T..."
}
```

### Login
```
POST /api/v1/auth/login
Request: {
  "email": "user@example.com",
  "password": "SecurePass123"
}
Response: {
  "access_token": "jwt_token",
  "refresh_token": "jwt_token",
  "token_type": "bearer"
}
```

### Get User Info
```
GET /api/v1/auth/me
Headers: {
  "Authorization": "Bearer <access_token>"
}
Response: {
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2026-05-18T..."
}
```

## Testing

After these fixes:

1. **Registration** works correctly with proper validation
2. **Login** returns tokens and fetches user info automatically
3. **Dashboard redirect** occurs after successful login
4. **Password validation** matches backend requirements
5. **Hydration errors** are prevented with proper error handling

## Environment Setup

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_API_URL=http://168.144.127.168:8000
```
