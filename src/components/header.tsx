"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <circle cx="12" cy="10" r="2" />
              <path d="M12 12v8" />
            </svg>
            <span className="font-bold text-xl">Itinerary Generator</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/create" className="text-sm font-medium transition-colors hover:text-primary">
            Create
          </Link>
          <Link href="/examples" className="text-sm font-medium transition-colors hover:text-primary">
            Examples
          </Link>
          <Link href="/help" className="text-sm font-medium transition-colors hover:text-primary">
            Help
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              Sign up
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
