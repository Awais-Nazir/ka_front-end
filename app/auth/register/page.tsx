import { RegisterForm } from '@/components/auth/register-form'

export const metadata = {
  title: 'Sign Up - AI Knowledge Assistant',
  description: 'Create a new AI Knowledge Assistant account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Knowledge Assistant</h1>
          <p className="text-muted-foreground">Your AI-powered document analysis platform</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
