
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FuturiseIcon } from "@/components/icons"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#testimonials", label: "Testimonials" },
]

export function Navbar() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <FuturiseIcon className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">Futurise</span>
        </Link>
        
        {!isDashboard && (
            <nav className="hidden md:flex items-center gap-6 text-sm">
                {navLinks.map(({ href, label }) => (
                    <Link
                    key={href}
                    href={href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                    {label}
                    </Link>
                ))}
            </nav>
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
            {!isDashboard && !isAuthPage && (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" asChild>
                      <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                      <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-8">
                            <FuturiseIcon className="h-6 w-6 text-primary" />
                            <span className="font-bold font-headline text-lg">Futurise</span>
                        </div>
                        <nav className="flex flex-col gap-4 text-lg">
                        {navLinks.map(({ href, label }) => (
                            <Link
                            key={href}
                            href={href}
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                            {label}
                            </Link>
                        ))}
                        </nav>
                        <div className="mt-auto flex flex-col gap-2">
                           <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
                           <Button asChild><Link href="/signup">Get Started</Link></Button>
                        </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
        </div>
      </div>
    </header>
  )
}
