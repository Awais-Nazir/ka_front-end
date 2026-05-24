# Testing Guide

## Quick Test Steps

### 1. Register a New User
1. Go to `http://localhost:3000/auth/register`
2. Fill in the form with:
   - **Full Name**: Your Name
   - **Email**: unique@example.com (must be unique)
   - **Password**: SecurePass123 (must have uppercase + number)
   - **Confirm Password**: SecurePass123
3. Click "Create Account"
4. Should be redirected to `/auth/login` with success toast

### 2. Login
1. Go to `http://localhost:3000/auth/login`
2. Enter the email and password you just created
3. Click "Sign In"
4. Should be redirected to `/dashboard/documents` with user authenticated

### 3. Documents Management
1. You should see the Documents page with:
   - Upload area at the top
   - Empty documents table initially
2. Try uploading a PDF or text file
3. Document should appear in the table with PENDING status
4. Status will update to PROCESSING then READY (watch for auto-polling)

### 4. Chat
1. Navigate to the Chat section from the sidebar
2. Try creating a new chat message
3. Messages should appear with proper formatting
4. Document citations should show if available

## Common Password Requirements

The backend API requires passwords to:
- Be at least 8 characters long
- Be at most 72 characters long
- Contain at least one **uppercase letter** (A-Z)
- May require at least one **number** (0-9)

Valid examples:
- `SecurePass123`
- `MyPassword456`
- `TestAccount789`

Invalid examples:
- `password123` (no uppercase)
- `PASSWORD` (too short, no number)
- `Pass1` (too short)

## Troubleshooting

### 422 Unprocessable Entity on Register
**Cause**: Usually password doesn't meet backend requirements
**Fix**: Ensure password has uppercase letter AND number

### Login fails but registration succeeded
**Cause**: Email/password mismatch
**Fix**: Double-check credentials, case-sensitive

### Hydration mismatch error
**Cause**: Browser extension modifying DOM or stale localStorage
**Fix**: Clear browser cache and localStorage:
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

### Protected routes not working
**Cause**: Access token not being sent properly
**Fix**: Check that `NEXT_PUBLIC_API_URL` environment variable is set correctly

## Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://168.144.127.168:8000
```

For local backend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Manual API Testing (with curl)

### Register
```bash
curl -X POST http://168.144.127.168:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://168.144.127.168:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Get User Info (with token)
```bash
curl -X GET http://168.144.127.168:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
