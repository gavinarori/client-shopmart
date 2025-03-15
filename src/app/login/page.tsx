import Link from 'next/link'

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col  p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden m-3 bg-muted rounded-xl lg:block">
        <img
          src="/assests/login.jpg"
          alt="Image"
          className="absolute inset-0 rounded-xl h-full w-full object-cover "
        />
      </div>
    </div>
  )
}