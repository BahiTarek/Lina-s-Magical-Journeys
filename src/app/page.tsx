import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
            Itinerary Generator
          </h1>
          <p className="text-xl mb-8">
            Create beautiful travel itineraries with maps and customizable layouts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h2" />
                  <path d="M8 17h2" />
                  <path d="M14 13h2" />
                  <path d="M14 17h2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Easy Data Input</h3>
              <p className="text-muted-foreground text-center">
                Upload spreadsheets or manually enter your itinerary details
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Interactive Maps</h3>
              <p className="text-muted-foreground text-center">
                Visualize your journey with integrated maps for each destination
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Beautiful Presentations</h3>
              <p className="text-muted-foreground text-center">
                Generate professional PDF presentations to share with travelers
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/create">
              <Button size="lg" className="font-semibold">
                Create New Itinerary
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="outline" size="lg" className="font-semibold">
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-16 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-3">1</div>
            <h3 className="font-medium mb-2">Upload Data</h3>
            <p className="text-sm text-muted-foreground">Import your spreadsheet or enter details manually</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-3">2</div>
            <h3 className="font-medium mb-2">Customize</h3>
            <p className="text-sm text-muted-foreground">Choose themes, layouts, and map options</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-3">3</div>
            <h3 className="font-medium mb-2">Preview</h3>
            <p className="text-sm text-muted-foreground">Review your itinerary before finalizing</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-3">4</div>
            <h3 className="font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">Get your PDF presentation or share via link</p>
          </div>
        </div>
      </div>
    </main>
  )
}
