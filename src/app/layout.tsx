import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "./providers" // Import the Providers component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Itinerary Generator",
  description: "Create beautiful travel itineraries with maps and customizable layouts",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap the main content with Providers */}
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
