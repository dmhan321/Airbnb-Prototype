/**
 * Date utility functions for consistent date handling
 * All dates are handled in UTC to avoid timezone issues
 */

/**
 * Parses a YYYY-MM-DD date string as UTC midnight
 * This ensures consistent date parsing regardless of server timezone
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} - Date object at UTC midnight
 */
const parseDateUTC = (dateString) => {
  if (!dateString) return null;
  
  // Parse YYYY-MM-DD format as UTC midnight
  const [year, month, day] = dateString.split('-').map(Number);
  // Use Date.UTC to create date at UTC midnight
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

/**
 * Gets today's date at UTC midnight
 * @returns {Date} - Today at UTC midnight
 */
const getTodayUTC = () => {
  const now = new Date();
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));
};

/**
 * Formats a date as YYYY-MM-DD in UTC
 * @param {Date} date - Date object
 * @returns {string} - Date string in YYYY-MM-DD format
 */
const formatDateUTC = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Normalizes a date to UTC midnight
 * @param {Date|string} date - Date object or date string
 * @returns {Date} - Date at UTC midnight
 */
const normalizeToUTCMidnight = (date) => {
  if (!date) return null;
  
  const d = typeof date === 'string' ? parseDateUTC(date) : new Date(date);
  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    0, 0, 0, 0
  ));
};

module.exports = {
  parseDateUTC,
  getTodayUTC,
  formatDateUTC,
  normalizeToUTCMidnight
};

