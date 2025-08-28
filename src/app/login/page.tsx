
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FuturiseIcon } from "@/components/icons"
import { signInWithGoogle, useUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle()
    if (success) {
      // The useUser hook will pick up the change and the useEffect above will redirect.
      // Forcing a reload can also ensure all components re-evaluate the user state.
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <FuturiseIcon className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline text-2xl">Welcome to Futurise</CardTitle>
            </div>
          <CardDescription>Sign in to continue to your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full text-base" onClick={handleGoogleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px" className="mr-2 h-5 w-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.373-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.816,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
