/**
 * Date Utilities
 */

/**
 * Format date to DD/MM/YYYY HH:mm:ss format (12-hour)
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

/**
 * Format date only as DD/MM/YYYY
 */
export const formatDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Convert local date to UTC ISO format
 */
export const toUTC = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString();
};

/**
 * Parse DD/MM/YYYY to Date object
 */
export const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};
