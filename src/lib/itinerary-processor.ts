/**
 * Core logic for the itinerary generator converted from Apps Script to JavaScript
 * This module handles the processing of itinerary data and generation of presentation content
 */

// Types for TypeScript
interface ItineraryItem {
  timing: string;
  category: string;
  description: string;
}

interface DayData {
  day: string;
  city: string;
  date: string;
  items: ItineraryItem[];
  allMeals: Set<string>;
}

interface ItineraryData {
  title: string;
  days: Record<string, DayData>;
}

/**
 * Process spreadsheet data into structured itinerary data
 * @param {Array<Array<any>>} data - Raw data from spreadsheet
 * @returns {ItineraryData} Processed itinerary data
 */
export function processItineraryData(data: any[][]): ItineraryData {
  // Extract trip title from the first row
  const tripTitle = data[0]?.[1] || "Travel Itinerary";
  
  // Group items by day and detect all meals for each day
  const grouped: Record<string, DayData> = {};
  
  // Skip header rows and process data rows
  data.slice(2)
    .filter(row => 
      row[0] && row[1] && row[5] &&                // 1. Day, City, and Description are not empty
      row[0].toString().trim().toLowerCase() !== 'day' && // 2. First cell is NOT 'Day'
      row[1].toString().trim().toLowerCase() !== 'city'   // 3. Second cell is NOT 'City'
    )
    .forEach(row => {
      const [day, city, date, timing, category, description] = row;
      
      if (!grouped[day]) {
        grouped[day] = { 
          day,
          city, 
          date, 
          items: [],
          allMeals: new Set() // Using Set to avoid duplicates
        };
      }
      
      // Add item to day's items
      grouped[day].items.push({ 
        timing: String(timing).trim(), // Ensure timing is string and trimmed
        category, 
        description 
      });
      
      // Detect meals in this item and add to day's allMeals
      detectMealsInItem(category, description).forEach(meal => {
        grouped[day].allMeals.add(meal);
      });
    });
  
  return {
    title: tripTitle,
    days: grouped
  };
}

/**
 * Detects meals mentioned in item text
 * @param {string} category - Item category
 * @param {string} description - Item description
 * @returns {Array<string>} Array of detected meals
 */
export function detectMealsInItem(category: string, description: string): string[] {
  const mealKeywords = ["breakfast", "brunch", "lunch", "dinner"];
  const detectedMeals: string[] = [];
  const text = `${category} ${description}`.toLowerCase();
  
  mealKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      detectedMeals.push(keyword);
    }
  });
  
  return detectedMeals;
}

/**
 * Formats meals text for display
 * @param {Array<string>} mealsArray - Array of meals
 * @returns {string} Formatted meals text
 */
export function formatMealsText(mealsArray: string[]): string {
  if (mealsArray.length === 0) return "No meals detected";
  
  // Capitalize first letter of each meal
  const capitalized = mealsArray.map(meal => 
    meal.charAt(0).toUpperCase() + meal.slice(1)
  );
  
  return capitalized.join(" & ");
}

/**
 * Calculates day duration based on timing
 * @param {Array<ItineraryItem>} items - Array of items
 * @returns {string} Formatted duration
 */
export function calculateDayDuration(items: ItineraryItem[]): string {
  if (items.length === 0) return "0 hours";
  
  const times: number[] = [];
  for (const item of items) {
    const timeStr = item.timing;
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    
    if (!timeMatch) {
      console.warn(`Invalid time format: ${timeStr}`);
      continue;
    }
    
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.warn(`Invalid time value: ${timeStr}`);
      continue;
    }
    
    times.push(hours * 60 + minutes);
  }
  
  if (times.length === 0) return "0 hours";
  
  const firstTime = Math.min(...times);
  const lastTime = Math.max(...times);
  let durationMinutes = lastTime - firstTime;
  
  // Handle overnight durations
  if (durationMinutes < 0) durationMinutes += 1440;
  
  const durationHours = durationMinutes / 60;
  
  // Format output
  if (durationHours >= 24) return "Full day";
  if (durationHours % 1 === 0) return `${durationHours} hours`;
  return `${durationHours.toFixed(1)} hours`;
}

/**
 * Formats time for display
 * @param {string} timeValue - Time value
 * @returns {string} Formatted time
 */
export function formatTime(timeValue: string): string {
  if (!timeValue) return "Time";
  return String(timeValue).trim(); // Return exactly as in sheet
}

/**
 * Formats date for display
 * @param {string|Date} dateValue - Date value
 * @returns {string} Formatted date
 */
export function formatDate(dateValue: string | Date): string {
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // Try to parse the date string
  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  } catch (e) {
    console.warn(`Error parsing date: ${dateValue}`);
  }
  
  return String(dateValue).split('GMT')[0].trim();
}

/**
 * Gets category icon based on category name
 * @param {string} category - Category name
 * @returns {string} Icon HTML
 */
export function getCategoryIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    'sightseeing': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    'food': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h10"/><path d="M7 14h10"/><circle cx="12" cy="12" r="9"/></svg>',
    'transportation': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>',
    'accommodation': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/><path d="M6 14h12"/></svg>',
    'activity': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="m16 12-4 4-4-4"/></svg>'
  };
  
  const lowerCategory = category.toLowerCase();
  return categoryIcons[lowerCategory] || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
}

/**
 * Generates city coordinates for map display
 * @param {string} city - City name
 * @returns {Promise<{lat: number, lng: number}>} City coordinates
 */
export async function getCityCoordinates(city: string): Promise<{lat: number, lng: number}> {
  // In a real implementation, this would use a geocoding API
  // For now, we'll use a simple lookup table with some common cities
  const cityCoordinates: Record<string, {lat: number, lng: number}> = {
    'paris': { lat: 48.8566, lng: 2.3522 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'new york': { lat: 40.7128, lng: -74.0060 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'rome': { lat: 41.9028, lng: 12.4964 },
    'sydney': { lat: -33.8688, lng: 151.2093 },
    'barcelona': { lat: 41.3851, lng: 2.1734 },
    'amsterdam': { lat: 52.3676, lng: 4.9041 },
    'berlin': { lat: 52.5200, lng: 13.4050 },
    'madrid': { lat: 40.4168, lng: -3.7038 }
  };
  
  const lowerCity = city.toLowerCase();
  
  // Return coordinates if found, otherwise return default coordinates
  return cityCoordinates[lowerCity] || { lat: 0, lng: 0 };
}

/**
 * Parses CSV data into a 2D array
 * @param {string} csvText - CSV text content
 * @returns {Array<Array<string>>} Parsed data
 */
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  return lines.map(line => {
    // Handle quoted values with commas inside them
    const result = [];
    let inQuote = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    result.push(currentValue);
    
    return result;
  });
}

/**
 * Parses Excel data into a 2D array (placeholder)
 * @param {ArrayBuffer} excelData - Excel file data
 * @returns {Promise<Array<Array<string>>>} Parsed data
 */
export async function parseExcel(excelData: ArrayBuffer): Promise<string[][]> {
  // In a real implementation, this would use a library like SheetJS/xlsx
  // For now, we'll return a placeholder
  console.warn('Excel parsing not implemented yet');
  return [
    ['Title', 'Sample Itinerary'],
    ['Day', 'City', 'Date', 'Time', 'Category', 'Description'],
    ['1', 'Paris', '2025-05-01', '09:00', 'Sightseeing', 'Eiffel Tower']
  ];
}

/**
 * Generates PDF content from itinerary data (placeholder)
 * @param {ItineraryData} itineraryData - Processed itinerary data
 * @returns {Promise<Blob>} PDF blob
 */
export async function generatePDF(itineraryData: ItineraryData): Promise<Blob> {
  // In a real implementation, this would use a library like react-pdf or jsPDF
  // For now, we'll return a placeholder
  console.warn('PDF generation not implemented yet');
  
  // Create a simple text representation
  let content = `${itineraryData.title}\n\n`;
  
  Object.values(itineraryData.days).forEach(day => {
    content += `Day ${day.day} - ${day.city} (${day.date})\n`;
    content += `${'-'.repeat(40)}\n`;
    
    day.items.forEach(item => {
      content += `${item.timing} - ${item.category}: ${item.description}\n`;
    });
    
    content += `\n`;
  });
  
  // Create a text blob as a placeholder
  return new Blob([content], { type: 'text/plain' });
}
