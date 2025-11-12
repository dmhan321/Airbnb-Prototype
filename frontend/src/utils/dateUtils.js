/**
 * Utility functions for date handling
 * Ensures consistent date formatting without timezone issues
 */

/**
 * Formats a date as YYYY-MM-DD in local timezone (not UTC)
 * This prevents timezone shifts when converting dates
 * @param {Date} date - The date to format
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const formatDateLocal = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parses a YYYY-MM-DD date string and returns a Date object at midnight local time
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} - Date object at midnight local time
 */
export const parseDateLocal = (dateString) => {
  if (!dateString) return null;
  
  // Parse YYYY-MM-DD format
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  
  return date;
};

/**
 * Formats a date as YYYY-MM-DD in UTC timezone (to match backend)
 * @param {Date|string} date - The date to format
 * @returns {string} - Date string in YYYY-MM-DD format (UTC)
 */
export const formatDateUTC = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parses a YYYY-MM-DD date string as UTC midnight
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} - Date object at UTC midnight
 */
export const parseDateUTC = (dateString) => {
  if (!dateString) return null;
  
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

/**
 * Gets all dates in a range (excluding end date) in UTC
 * This matches how backend generates blocked dates
 * @param {string|Date} startDate - Start date (YYYY-MM-DD string or Date)
 * @param {string|Date} endDate - End date (YYYY-MM-DD string or Date)
 * @returns {string[]} - Array of date strings in YYYY-MM-DD format (UTC)
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  
  // Parse dates as UTC midnight to match backend
  const start = typeof startDate === 'string' ? parseDateUTC(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseDateUTC(endDate) : new Date(endDate);
  
  // Normalize to UTC midnight
  const startUTC = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    0, 0, 0, 0
  ));
  const endUTC = new Date(Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
    0, 0, 0, 0
  ));
  
  // Generate dates in UTC (excluding end date)
  let currentDate = new Date(startUTC);
  while (currentDate < endUTC) {
    dates.push(formatDateUTC(currentDate));
    currentDate = new Date(currentDate);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  
  return dates;
};

