# AI Knowledge Assistant Frontend

A modern, full-featured frontend for an AI-powered knowledge base application built with Next.js 16, React 19, and TypeScript.

## Features

- **Authentication**: User registration and login with JWT token refresh
- **Document Management**: Upload, view, and manage documents with processing status tracking
- **AI Chat**: Interactive chat sessions with document-aware responses and citations
- **Real-time Status**: Auto-polling for document processing status
- **Responsive Design**: Mobile-first, works seamlessly on all devices
- **Error Handling**: Comprehensive error handling and user feedback via toast notifications

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 with shadcn/ui components
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios with auto-refresh interceptors
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-knowledge-assistant-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── auth/              # Authentication pages
│   ├── login/
│   └── register/
├── dashboard/         # Protected dashboard
│   ├── documents/     # Document management
│   ├── chat/          # Chat interface
│   └── layout.tsx
├── layout.tsx         # Root layout with providers
├── page.tsx          # Landing page
└── globals.css       # Global styles

components/
├── auth/             # Auth form components
│   ├── login-form.tsx
│   └── register-form.tsx
├── dashboard/        # Dashboard components
│   └── nav.tsx       # Navigation sidebar
├── documents/        # Document components
│   ├── upload-area.tsx
│   ├── documents-table.tsx
│   └── status-badge.tsx
└── chat/            # Chat components
    ├── message.tsx
    ├── message-input.tsx
    ├── sessions-list.tsx
    └── chat-view.tsx

lib/
├── api.ts               # Axios client with interceptors
├── auth-context.tsx     # Auth state management
├── documents-context.tsx # Documents state management
├── chat-context.tsx     # Chat state management
├── protected-route.tsx   # Protected route wrapper
└── utils.ts            # Utility functions
```

## Key Features Explained

### Authentication Flow
- Login/Registration with email and password
- JWT tokens stored in localStorage
- Automatic token refresh on 401 responses
- Protected routes redirect to login when not authenticated

### Document Management
- Drag-and-drop or click to upload documents
- Real-time status updates (PENDING → PROCESSING → READY/FAILED)
- Auto-polling every 3 seconds while documents are processing
- Delete documents with confirmation dialog
- File size and upload time display

### Chat Interface
- Create multiple chat sessions
- Persistent session management
- AI responses with document citations
- Citation pills showing document names and page numbers
- Message input with Shift+Enter support for new lines
- Auto-scrolling to latest messages
- Typing indicator during message processing

## API Integration

The frontend communicates with a backend API. Expected endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload document
- `DELETE /api/documents/{id}` - Delete document

### Chat
- `GET /api/chat/sessions` - List chat sessions
- `POST /api/chat/sessions` - Create new session
- `DELETE /api/chat/sessions/{id}` - Delete session
- `GET /api/chat/sessions/{id}/messages` - Get session messages
- `POST /api/chat/sessions/{id}/messages` - Send message

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable `NEXT_PUBLIC_API_URL` in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js and Next.js.

## Development

### Run Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Components

All UI components come from shadcn/ui and are pre-installed. To add more:

```bash
npx shadcn-ui@latest add <component-name>
```

## Troubleshooting

### API Connection Issues
- Ensure `NEXT_PUBLIC_API_URL` is correctly set
- Verify backend server is running
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage in browser DevTools
- Check if tokens are being properly stored
- Verify API returns correct token format

### Document Upload Issues
- Check file size and format
- Ensure API endpoint is working
- Check browser console for errors

## Contributing

Contributions are welcome! Please follow the existing code style and create a pull request.

## License

MIT License - feel free to use this project for any purpose.
