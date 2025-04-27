/**
 * PDF Generation Module for Itinerary Generator
 * This module handles the creation of PDF documents from itinerary data
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ItineraryData, DayData, ItineraryItem } from '@/types/itinerary';

/**
 * Generates a PDF document from itinerary data
 * @param {ItineraryData} itineraryData - Processed itinerary data
 * @returns {Promise<Blob>} PDF blob
 */
export async function generatePDF(itineraryData: ItineraryData): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title page
  createTitlePage(doc, itineraryData);
  
  // Add overview page with map
  createOverviewPage(doc, itineraryData);
  
  // Add day pages
  Object.values(itineraryData.days).forEach((day, index) => {
    // Add a new page for each day (except the first one which follows the overview)
    if (index > 0) {
      doc.addPage();
    }
    createDayPage(doc, day, itineraryData);
  });
  
  // Return the PDF as a blob
  return doc.output('blob');
}

/**
 * Creates the title page of the PDF
 * @param {jsPDF} doc - PDF document
 * @param {ItineraryData} itineraryData - Itinerary data
 */
function createTitlePage(doc: jsPDF, itineraryData: ItineraryData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(233, 75, 55); // #e94b37
  doc.text(itineraryData.title, pageWidth / 2, 60, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(16);
  doc.setTextColor(46, 28, 69); // #2e1c45
  
  // Calculate date range
  const days = Object.values(itineraryData.days);
  let dateRange = '';
  
  if (days.length > 0) {
    const firstDay = days[0];
    const lastDay = days[days.length - 1];
    
    if (firstDay.date && lastDay.date) {
      dateRange = `${formatDate(firstDay.date)} - ${formatDate(lastDay.date)}`;
    }
  }
  
  if (dateRange) {
    doc.text(dateRange, pageWidth / 2, 75, { align: 'center' });
  }
  
  // Add cities list
  const cities = [...new Set(days.map(day => day.city))];
  if (cities.length > 0) {
    doc.setFontSize(14);
    doc.text(`Visiting: ${cities.join(' • ')}`, pageWidth / 2, 90, { align: 'center' });
  }
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Generated with Itinerary Generator', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 15, { align: 'center' });
}

/**
 * Creates the overview page with map and summary
 * @param {jsPDF} doc - PDF document
 * @param {ItineraryData} itineraryData - Itinerary data
 */
function createOverviewPage(doc: jsPDF, itineraryData: ItineraryData): void {
  doc.addPage();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add page title
  doc.setFontSize(18);
  doc.setTextColor(233, 75, 55); // #e94b37
  doc.text('Trip Overview', pageWidth / 2, 20, { align: 'center' });
  
  // Add map placeholder
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(20, 30, pageWidth - 40, 80, 3, 3, 'FD');
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Map Overview', pageWidth / 2, 70, { align: 'center' });
  
  // Add itinerary summary table
  doc.setFontSize(14);
  doc.setTextColor(46, 28, 69); // #2e1c45
  doc.text('Itinerary Summary', 20, 130);
  
  const days = Object.values(itineraryData.days);
  const tableData = days.map(day => [
    `Day ${day.day}`,
    day.city,
    formatDate(day.date),
    Array.from(day.allMeals).map(meal => 
      meal.charAt(0).toUpperCase() + meal.slice(1)
    ).join(' & ') || 'No meals specified',
    `${day.items.length} activities`
  ]);
  
  // @ts-ignore - jspdf-autotable types
  doc.autoTable({
    startY: 135,
    head: [['Day', 'City', 'Date', 'Meals', 'Activities']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [233, 75, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 50 },
      4: { cellWidth: 30 }
    }
  });
}

/**
 * Creates a page for a single day
 * @param {jsPDF} doc - PDF document
 * @param {DayData} day - Day data
 * @param {ItineraryData} itineraryData - Full itinerary data
 */
function createDayPage(doc: jsPDF, day: DayData, itineraryData: ItineraryData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add day header
  doc.setFontSize(18);
  doc.setTextColor(233, 75, 55); // #e94b37
  doc.text(`Day ${day.day} - ${day.city}`, pageWidth / 2, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(14);
  doc.setTextColor(46, 28, 69); // #2e1c45
  doc.text(`📅 ${formatDate(day.date)}`, pageWidth / 2, 30, { align: 'center' });
  
  // Add city map placeholder
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(pageWidth - 70, 40, 50, 50, 3, 3, 'FD');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('City Map', pageWidth - 45, 65, { align: 'center' });
  
  // Add activities
  doc.setFontSize(14);
  doc.setTextColor(46, 28, 69); // #2e1c45
  doc.text('Activities', 20, 50);
  
  // Create activities table
  const tableData = day.items.map(item => [
    item.timing,
    item.category,
    item.description
  ]);
  
  // @ts-ignore - jspdf-autotable types
  doc.autoTable({
    startY: 55,
    head: [['Time', 'Category', 'Description']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [233, 75, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 130 }
    }
  });
  
  // Add meals and duration footer
  const lastY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(233, 75, 55); // #e94b37
  
  // Format meals
  const mealsText = Array.from(day.allMeals).map(meal => 
    meal.charAt(0).toUpperCase() + meal.slice(1)
  ).join(' & ') || 'No meals detected';
  
  doc.text(`Meals: ${mealsText}`, 20, lastY);
  
  // Calculate and add duration
  const duration = calculateDayDuration(day.items);
  doc.text(`Duration: ${duration}`, 20, lastY + 10);
}

/**
 * Formats date for display
 * @param {string|Date} dateValue - Date value
 * @returns {string} Formatted date
 */
function formatDate(dateValue: string | Date): string {
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
 * Calculates day duration based on timing
 * @param {Array<ItineraryItem>} items - Array of items
 * @returns {string} Formatted duration
 */
function calculateDayDuration(items: ItineraryItem[]): string {
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
