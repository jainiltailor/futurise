
"use client"

import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard/nav"
import { FooterDashboard } from "@/components/layout/footer-dashboard"
import { HeaderDashboard } from "@/components/layout/header-dashboard"
import { useUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    // If the user's auth state is resolved and they are not logged in, redirect to login
    if (user === null) {
      router.push("/login")
    }
  }, [user, router])

  // While checking auth state, show a loader
  if (user === undefined) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If user is logged in, render the dashboard
  return user ? (
    <SidebarProvider>
      <div className="flex flex-col min-h-[calc(100vh)]">
        <div className="flex flex-1">
          <Sidebar variant="floating">
              <DashboardNav />
          </Sidebar>
          <SidebarInset className="flex flex-col flex-1">
            <HeaderDashboard />
            <div className="p-4 sm:p-6 lg:p-8 flex-grow">
              {children}
            </div>
          </SidebarInset>
        </div>
        <FooterDashboard />
      </div>
    </SidebarProvider>
  ) : null; // Render nothing while redirecting
}
