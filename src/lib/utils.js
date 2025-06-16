// src/lib/utils.js

/**
 * Simple utility function to merge class names
 * @param  {...any} classes 
 * @returns {string}
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}