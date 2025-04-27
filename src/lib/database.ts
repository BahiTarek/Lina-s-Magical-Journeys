/**
 * Database service for Itinerary Generator
 * This module handles interactions with the Cloudflare D1 database
 */

import { ItineraryData, DayData, ItineraryItem } from '@/types/itinerary';

/**
 * Retrieves all itineraries for a user
 * @param {string} userId - User ID
 * @returns {Promise<ItineraryData[]>} - Array of itineraries
 */
export async function getItinerariesForUser(userId: string): Promise<ItineraryData[]> {
  try {
    // In a production environment, this would query the D1 database
    // For development, we'll return mock data
    return [
      {
        id: 'itinerary_1',
        title: 'European Vacation',
        days: {
          '1': {
            day: '1',
            city: 'Paris',
            date: '2025-05-01',
            items: [
              { timing: '09:00', category: 'Sightseeing', description: 'Eiffel Tower visit' },
              { timing: '12:30', category: 'Food', description: 'Lunch at Café de Paris' },
              { timing: '15:00', category: 'Sightseeing', description: 'Louvre Museum' }
            ],
            allMeals: new Set(['lunch'])
          },
          '2': {
            day: '2',
            city: 'Paris',
            date: '2025-05-02',
            items: [
              { timing: '10:00', category: 'Sightseeing', description: 'Notre-Dame Cathedral' },
              { timing: '13:00', category: 'Food', description: 'Lunch at Le Petit Bistro' },
              { timing: '16:00', category: 'Shopping', description: 'Champs-Élysées' }
            ],
            allMeals: new Set(['lunch'])
          },
          '3': {
            day: '3',
            city: 'Rome',
            date: '2025-05-03',
            items: [
              { timing: '09:30', category: 'Sightseeing', description: 'Colosseum' },
              { timing: '13:00', category: 'Food', description: 'Lunch at Trattoria Roma' },
              { timing: '16:00', category: 'Sightseeing', description: 'Vatican Museums' }
            ],
            allMeals: new Set(['lunch'])
          }
        },
        createdAt: new Date('2025-04-15'),
        updatedAt: new Date('2025-04-20')
      }
    ];
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return [];
  }
}

/**
 * Retrieves a single itinerary by ID
 * @param {string} itineraryId - Itinerary ID
 * @returns {Promise<ItineraryData|null>} - Itinerary data or null if not found
 */
export async function getItineraryById(itineraryId: string): Promise<ItineraryData|null> {
  try {
    // In a production environment, this would query the D1 database
    // For development, we'll return mock data
    if (itineraryId === 'itinerary_1') {
      return {
        id: 'itinerary_1',
        title: 'European Vacation',
        days: {
          '1': {
            day: '1',
            city: 'Paris',
            date: '2025-05-01',
            items: [
              { timing: '09:00', category: 'Sightseeing', description: 'Eiffel Tower visit' },
              { timing: '12:30', category: 'Food', description: 'Lunch at Café de Paris' },
              { timing: '15:00', category: 'Sightseeing', description: 'Louvre Museum' }
            ],
            allMeals: new Set(['lunch'])
          },
          '2': {
            day: '2',
            city: 'Paris',
            date: '2025-05-02',
            items: [
              { timing: '10:00', category: 'Sightseeing', description: 'Notre-Dame Cathedral' },
              { timing: '13:00', category: 'Food', description: 'Lunch at Le Petit Bistro' },
              { timing: '16:00', category: 'Shopping', description: 'Champs-Élysées' }
            ],
            allMeals: new Set(['lunch'])
          },
          '3': {
            day: '3',
            city: 'Rome',
            date: '2025-05-03',
            items: [
              { timing: '09:30', category: 'Sightseeing', description: 'Colosseum' },
              { timing: '13:00', category: 'Food', description: 'Lunch at Trattoria Roma' },
              { timing: '16:00', category: 'Sightseeing', description: 'Vatican Museums' }
            ],
            allMeals: new Set(['lunch'])
          }
        },
        createdAt: new Date('2025-04-15'),
        updatedAt: new Date('2025-04-20')
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return null;
  }
}

/**
 * Creates a new itinerary
 * @param {ItineraryData} itineraryData - Itinerary data
 * @param {string} userId - User ID
 * @returns {Promise<string>} - ID of the created itinerary
 */
export async function createItinerary(
  itineraryData: ItineraryData,
  userId: string
): Promise<string> {
  try {
    // In a production environment, this would insert into the D1 database
    // For development, we'll return a mock ID
    const itineraryId = `itinerary_${Date.now()}`;
    console.log(`Created itinerary ${itineraryId} for user ${userId}`);
    return itineraryId;
  } catch (error) {
    console.error('Error creating itinerary:', error);
    throw new Error('Failed to create itinerary');
  }
}

/**
 * Updates an existing itinerary
 * @param {string} itineraryId - Itinerary ID
 * @param {ItineraryData} itineraryData - Updated itinerary data
 * @returns {Promise<boolean>} - Success status
 */
export async function updateItinerary(
  itineraryId: string,
  itineraryData: ItineraryData
): Promise<boolean> {
  try {
    // In a production environment, this would update the D1 database
    // For development, we'll just log the update
    console.log(`Updated itinerary ${itineraryId}`);
    return true;
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return false;
  }
}

/**
 * Deletes an itinerary
 * @param {string} itineraryId - Itinerary ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteItinerary(itineraryId: string): Promise<boolean> {
  try {
    // In a production environment, this would delete from the D1 database
    // For development, we'll just log the deletion
    console.log(`Deleted itinerary ${itineraryId}`);
    return true;
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return false;
  }
}

/**
 * Processes raw spreadsheet data into an itinerary
 * @param {any[][]} data - Raw spreadsheet data
 * @param {string} userId - User ID
 * @returns {Promise<string>} - ID of the created itinerary
 */
export async function processSpreadsheetData(
  data: any[][],
  userId: string
): Promise<string> {
  try {
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
    
    // Create the itinerary object
    const itineraryData: ItineraryData = {
      title: tripTitle,
      days: grouped,
      userId
    };
    
    // Save to database
    return await createItinerary(itineraryData, userId);
  } catch (error) {
    console.error('Error processing spreadsheet data:', error);
    throw new Error('Failed to process spreadsheet data');
  }
}

/**
 * Detects meals mentioned in item text
 * @param {string} category - Item category
 * @param {string} description - Item description
 * @returns {Array<string>} Array of detected meals
 */
function detectMealsInItem(category: string, description: string): string[] {
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
 * Gets user preferences
 * @param {string} userId - User ID
 * @returns {Promise<{theme: string, enableMaps: boolean, defaultTemplate: string}>} - User preferences
 */
export async function getUserPreferences(
  userId: string
): Promise<{theme: string, enableMaps: boolean, defaultTemplate: string}> {
  try {
    // In a production environment, this would query the D1 database
    // For development, we'll return default preferences
    return {
      theme: 'default',
      enableMaps: true,
      defaultTemplate: 'standard'
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return {
      theme: 'default',
      enableMaps: true,
      defaultTemplate: 'standard'
    };
  }
}

/**
 * Updates user preferences
 * @param {string} userId - User ID
 * @param {{theme?: string, enableMaps?: boolean, defaultTemplate?: string}} preferences - User preferences
 * @returns {Promise<boolean>} - Success status
 */
export async function updateUserPreferences(
  userId: string,
  preferences: {theme?: string, enableMaps?: boolean, defaultTemplate?: string}
): Promise<boolean> {
  try {
    // In a production environment, this would update the D1 database
    // For development, we'll just log the update
    console.log(`Updated preferences for user ${userId}:`, preferences);
    return true;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }
}
