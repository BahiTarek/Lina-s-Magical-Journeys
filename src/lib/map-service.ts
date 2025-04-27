/**
 * Map Integration Module for Web-Based Itinerary Generator
 * This module handles the integration with Google Maps API for the web application
 */

import { MapLocation } from '@/types/itinerary';

/**
 * Fetches coordinates for a city using Google Maps Geocoding API
 * @param {string} city - City name
 * @returns {Promise<MapLocation>} - Location with coordinates
 */
export async function fetchCityCoordinates(city: string): Promise<MapLocation> {
  try {
    // In a production environment, this would make an API call to Google Maps Geocoding API
    // For development, we'll use a static mapping of common cities
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
      'madrid': { lat: 40.4168, lng: -3.7038 },
      'venice': { lat: 45.4408, lng: 12.3155 },
      'florence': { lat: 43.7696, lng: 11.2558 },
      'prague': { lat: 50.0755, lng: 14.4378 },
      'vienna': { lat: 48.2082, lng: 16.3738 },
      'athens': { lat: 37.9838, lng: 23.7275 },
      'dubai': { lat: 25.2048, lng: 55.2708 },
      'singapore': { lat: 1.3521, lng: 103.8198 },
      'bangkok': { lat: 13.7563, lng: 100.5018 },
      'hong kong': { lat: 22.3193, lng: 114.1694 },
      'seoul': { lat: 37.5665, lng: 126.9780 }
    };
    
    const lowerCity = city.toLowerCase();
    
    // Return coordinates if found, otherwise use a geocoding service
    if (cityCoordinates[lowerCity]) {
      return {
        name: city,
        ...cityCoordinates[lowerCity]
      };
    }
    
    // Fallback to a simulated geocoding result
    console.log(`City "${city}" not found in static mapping, simulating geocoding result`);
    
    // Generate a random location near Europe as a fallback
    return {
      name: city,
      lat: 48 + (Math.random() * 10 - 5),
      lng: 10 + (Math.random() * 10 - 5)
    };
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    
    // Return a default location if there's an error
    return {
      name: city,
      lat: 0,
      lng: 0
    };
  }
}

/**
 * Generates a static map URL for a location
 * @param {MapLocation} location - Location with coordinates
 * @param {number} zoom - Zoom level (1-20)
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @returns {string} - URL for the static map image
 */
export function generateStaticMapUrl(
  location: MapLocation,
  zoom: number = 12,
  width: number = 600,
  height: number = 400
): string {
  // In a production environment, this would use your Google Maps API key
  // For development, we'll return a placeholder URL
  return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${location.lat},${location.lng}&key=YOUR_API_KEY`;
}

/**
 * Generates a static map URL for multiple locations
 * @param {MapLocation[]} locations - Array of locations
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @returns {string} - URL for the static map image
 */
export function generateMultiLocationMapUrl(
  locations: MapLocation[],
  width: number = 600,
  height: number = 400
): string {
  if (locations.length === 0) {
    return '';
  }
  
  // Calculate the center point of all locations
  const totalLat = locations.reduce((sum, loc) => sum + loc.lat, 0);
  const totalLng = locations.reduce((sum, loc) => sum + loc.lng, 0);
  const centerLat = totalLat / locations.length;
  const centerLng = totalLng / locations.length;
  
  // Calculate appropriate zoom level based on the distance between locations
  // This is a simplified approach - in a real app, you'd use a more sophisticated algorithm
  let zoom = 5;
  if (locations.length === 1) {
    zoom = 12;
  } else {
    // Find the maximum distance between any location and the center
    const maxDistance = Math.max(...locations.map(loc => {
      const latDiff = Math.abs(loc.lat - centerLat);
      const lngDiff = Math.abs(loc.lng - centerLng);
      return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    }));
    
    // Adjust zoom based on maximum distance
    if (maxDistance < 0.1) zoom = 11;
    else if (maxDistance < 0.5) zoom = 10;
    else if (maxDistance < 1) zoom = 9;
    else if (maxDistance < 2) zoom = 8;
    else if (maxDistance < 4) zoom = 7;
    else if (maxDistance < 8) zoom = 6;
    else zoom = 5;
  }
  
  // Build markers string
  const markers = locations.map((loc, index) => {
    // Use different colors for each marker
    const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow'];
    const color = colors[index % colors.length];
    return `markers=color:${color}%7Clabel:${index + 1}%7C${loc.lat},${loc.lng}`;
  }).join('&');
  
  // In a production environment, this would use your Google Maps API key
  return `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoom}&size=${width}x${height}&${markers}&key=YOUR_API_KEY`;
}

/**
 * Fetches points of interest for a location using Google Places API
 * @param {MapLocation} location - Location with coordinates
 * @returns {Promise<Array<{name: string, type: string}>>} - Array of points of interest
 */
export async function fetchPointsOfInterest(
  location: MapLocation
): Promise<Array<{name: string, type: string}>> {
  try {
    // In a production environment, this would make an API call to Google Places API
    // For development, we'll return static data based on the city
    const poiByCity: Record<string, Array<{name: string, type: string}>> = {
      'paris': [
        { name: 'Eiffel Tower', type: 'attraction' },
        { name: 'Louvre Museum', type: 'museum' },
        { name: 'Notre-Dame Cathedral', type: 'attraction' },
        { name: 'Champs-Élysées', type: 'shopping' },
        { name: 'Montmartre', type: 'neighborhood' }
      ],
      'london': [
        { name: 'Big Ben', type: 'attraction' },
        { name: 'British Museum', type: 'museum' },
        { name: 'Buckingham Palace', type: 'attraction' },
        { name: 'Tower of London', type: 'attraction' },
        { name: 'Hyde Park', type: 'park' }
      ],
      'rome': [
        { name: 'Colosseum', type: 'attraction' },
        { name: 'Vatican Museums', type: 'museum' },
        { name: 'Trevi Fountain', type: 'attraction' },
        { name: 'Roman Forum', type: 'attraction' },
        { name: 'Pantheon', type: 'attraction' }
      ],
      'barcelona': [
        { name: 'Sagrada Familia', type: 'attraction' },
        { name: 'Park Güell', type: 'park' },
        { name: 'Casa Batlló', type: 'attraction' },
        { name: 'La Rambla', type: 'shopping' },
        { name: 'Gothic Quarter', type: 'neighborhood' }
      ]
    };
    
    const lowerCity = location.name.toLowerCase();
    
    // Return POIs if found for the city, otherwise return generic POIs
    if (poiByCity[lowerCity]) {
      return poiByCity[lowerCity];
    }
    
    // Return generic POIs for cities not in our static data
    return [
      { name: 'City Center', type: 'neighborhood' },
      { name: 'Main Square', type: 'attraction' },
      { name: 'Historical Museum', type: 'museum' },
      { name: 'Central Park', type: 'park' },
      { name: 'Shopping District', type: 'shopping' }
    ];
  } catch (error) {
    console.error('Error fetching points of interest:', error);
    return [];
  }
}

/**
 * Calculates the route between multiple locations
 * @param {MapLocation[]} locations - Array of locations in order of visit
 * @returns {Promise<{distance: string, duration: string, polyline: string}>} - Route information
 */
export async function calculateRoute(
  locations: MapLocation[]
): Promise<{distance: string, duration: string, polyline: string}> {
  try {
    if (locations.length < 2) {
      throw new Error('At least two locations are required to calculate a route');
    }
    
    // In a production environment, this would make an API call to Google Directions API
    // For development, we'll return simulated data
    
    // Calculate a rough estimate of distance and duration
    let totalDistance = 0;
    
    for (let i = 0; i < locations.length - 1; i++) {
      const loc1 = locations[i];
      const loc2 = locations[i + 1];
      
      // Calculate distance using the Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
      const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      totalDistance += distance;
    }
    
    // Estimate duration (assuming average speed of 60 km/h)
    const durationHours = totalDistance / 60;
    
    // Format distance and duration
    const formattedDistance = `${Math.round(totalDistance)} km`;
    const formattedDuration = `${Math.floor(durationHours)} hours ${Math.round((durationHours % 1) * 60)} minutes`;
    
    // Generate a dummy polyline (in a real app, this would come from the Directions API)
    const polyline = 'dummy_polyline_data';
    
    return {
      distance: formattedDistance,
      duration: formattedDuration,
      polyline: polyline
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return {
      distance: 'Unknown',
      duration: 'Unknown',
      polyline: ''
    };
  }
}
