/**
 * Types for the Itinerary Generator application
 */

export interface ItineraryItem {
  id?: number;
  timing: string;
  category: string;
  description: string;
}

export interface DayData {
  id?: number;
  day: string;
  city: string;
  date: string;
  items: ItineraryItem[];
  allMeals: Set<string>;
}

export interface ItineraryData {
  id?: string;
  title: string;
  days: Record<string, DayData>;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface ThemeSettings {
  headerColor: string;
  textColor: string;
  fontFamily: string;
}

export interface UserPreferences {
  theme: string;
  enableMaps: boolean;
  defaultTemplate: string;
}
