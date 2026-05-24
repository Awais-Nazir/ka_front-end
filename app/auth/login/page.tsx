import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Sign In - AI Knowledge Assistant',
  description: 'Sign in to your AI Knowledge Assistant account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Knowledge Assistant</h1>
          <p className="text-muted-foreground">Your AI-powered document analysis platform</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
