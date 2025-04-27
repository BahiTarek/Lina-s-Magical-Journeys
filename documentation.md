# Itinerary Generator Web Application - Documentation

## Overview
This documentation provides comprehensive information about the Itinerary Generator web application, which has been converted from Google Apps Script to a modern Next.js web application. The application allows users to create beautiful travel itineraries with maps and customizable layouts.

## Features
- **Spreadsheet Upload**: Import itinerary data from Excel, CSV, or Google Sheets
- **Manual Entry**: Create itineraries by manually entering trip details
- **Map Integration**: Visualize destinations with interactive maps
- **PDF Generation**: Create downloadable PDF itineraries
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Database Storage**: Save and retrieve itineraries

## Technology Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Pages, Cloudflare D1 (SQLite)
- **APIs**: Google Maps (for map integration)
- **Libraries**: jsPDF (for PDF generation)

## Project Structure
```
itinerary-generator/
├── migrations/              # Database migration files
│   └── 0001_initial.sql     # Initial database schema
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── create/          # Itinerary creation page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── ui/              # UI components (buttons, forms, etc.)
│   │   ├── file-upload.tsx  # File upload component
│   │   ├── footer.tsx       # Footer component
│   │   ├── google-map.tsx   # Map component
│   │   ├── header.tsx       # Header component
│   │   ├── itinerary-form.tsx # Form for manual entry
│   │   ├── map-integration.tsx # Map integration component
│   │   ├── mode-toggle.tsx  # Dark/light mode toggle
│   │   └── theme-provider.tsx # Theme provider component
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and services
│   │   ├── database.ts      # Database service
│   │   ├── itinerary-processor.ts # Core processing logic
│   │   ├── map-service.ts   # Map integration service
│   │   ├── pdf-generator.ts # PDF generation service
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript type definitions
│       └── itinerary.ts     # Itinerary-related types
├── wrangler.toml            # Cloudflare configuration
├── next.config.ts           # Next.js configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Installation

### Prerequisites
- Node.js 18.0.0 or later
- npm or pnpm package manager
- Cloudflare account (for deployment)

### Local Development
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd itinerary-generator
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

#### Cloudflare Pages
1. Install Wrangler CLI
   ```bash
   npm install -g wrangler
   ```

2. Log in to Cloudflare
   ```bash
   wrangler login
   ```

3. Build the application
   ```bash
   npm run build
   ```

4. Deploy to Cloudflare Pages
   ```bash
   wrangler pages deploy .next --project-name=itinerary-generator
   ```

#### Alternative Deployment Options
- **Vercel**: Connect your GitHub repository to Vercel for automatic deployment
- **Netlify**: Connect your GitHub repository to Netlify for automatic deployment

## Usage Guide

### Creating an Itinerary

#### Method 1: Spreadsheet Upload
1. Navigate to the "Create" page
2. Select the "Upload Spreadsheet" tab
3. Upload your spreadsheet file (Excel, CSV, or Google Sheets export)
4. The application will process your data and generate an itinerary

Your spreadsheet should follow this format:
| Day | City | Date | Time | Category | Description |
|-----|------|------|------|----------|-------------|
| 1 | Paris | 2025-05-01 | 09:00 | Sightseeing | Eiffel Tower visit |
| 1 | Paris | 2025-05-01 | 12:30 | Food | Lunch at Café de Paris |

#### Method 2: Manual Entry
1. Navigate to the "Create" page
2. Select the "Manual Entry" tab
3. Enter your trip details (name, dates)
4. Add days and activities using the form
5. Click "Continue" to generate your itinerary

### Viewing and Editing Itineraries
1. Navigate to the "My Itineraries" page
2. Select an itinerary to view or edit
3. Make changes as needed
4. Save your changes

### Generating PDFs
1. View your itinerary
2. Click the "Download PDF" button
3. The PDF will be generated and downloaded to your device

### Using Maps
1. In the itinerary view, select the "Maps" tab
2. View the overview map showing all destinations
3. Select individual cities to see detailed maps
4. Points of interest are displayed for each city

## API Reference

### Itinerary Processor
The core logic for processing itinerary data is in `src/lib/itinerary-processor.ts`.

```typescript
// Process spreadsheet data into structured itinerary data
function processItineraryData(data: any[][]): ItineraryData

// Detect meals mentioned in item text
function detectMealsInItem(category: string, description: string): string[]

// Calculate day duration based on timing
function calculateDayDuration(items: ItineraryItem[]): string
```

### Map Service
Map integration functions are in `src/lib/map-service.ts`.

```typescript
// Fetch coordinates for a city
async function fetchCityCoordinates(city: string): Promise<MapLocation>

// Generate a static map URL for a location
function generateStaticMapUrl(location: MapLocation, zoom?: number, width?: number, height?: number): string

// Fetch points of interest for a location
async function fetchPointsOfInterest(location: MapLocation): Promise<Array<{name: string, type: string}>>
```

### Database Service
Database functions are in `src/lib/database.ts`.

```typescript
// Retrieve all itineraries for a user
async function getItinerariesForUser(userId: string): Promise<ItineraryData[]>

// Create a new itinerary
async function createItinerary(itineraryData: ItineraryData, userId: string): Promise<string>

// Process spreadsheet data into an itinerary
async function processSpreadsheetData(data: any[][], userId: string): Promise<string>
```

## Customization

### Themes
The application supports both light and dark themes. Users can toggle between themes using the mode toggle button in the header.

### Map Customization
To use Google Maps in production, you'll need to add your Google Maps API key:

1. Create a Google Maps API key in the Google Cloud Console
2. Add the API key to the environment variables:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

### Database Configuration
The application uses Cloudflare D1 for database storage. To configure the database:

1. Create a D1 database in your Cloudflare account
2. Update the `wrangler.toml` file with your database ID
3. Apply the initial migration:
   ```bash
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

## Troubleshooting

### Common Issues
- **Map not displaying**: Check that you've added your Google Maps API key
- **PDF generation fails**: Ensure you have sufficient memory for large itineraries
- **Database errors**: Verify your D1 database is properly configured

### Getting Help
If you encounter any issues, please:
1. Check the console for error messages
2. Review the documentation
3. Contact support at support@example.com

## Future Enhancements
- Weather integration for each destination
- QR code generation for important locations
- Multi-language support
- Collaborative editing
- Mobile app version

## Credits
- Original Apps Script by [User]
- Converted to web application by Manus AI
- Icons from Lucide Icons
- UI components from shadcn/ui

## License
This project is licensed under the MIT License - see the LICENSE file for details.
