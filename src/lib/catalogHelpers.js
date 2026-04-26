import { formatEUR } from './formatters';

/**
 * Safely converts a value to a number.
 * Returns null if the value is invalid (NaN, infinite, or non-numeric type).
 */
const toNumber = (value) => {
  if (typeof value === 'number') {
    return isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    if (!value.trim()) return null;
    const parsed = parseFloat(value);
    return isFinite(parsed) && !isNaN(parsed) ? parsed : null;
  }
  return null;
};

/**
 * Returns a user-friendly label for an option.
 * Fallback priority: label -> name -> title -> 'Option'
 */
export const getOptionLabel = (option) => {
  if (!option) return 'Option';
  return option.label ?? option.name ?? option.title ?? 'Option';
};

/**
 * Validates and returns the price of an option.
 * Returns null if price is missing, not a number, or <= 0.
 */
export const getOptionPrice = (option) => {
  if (!option) return null;
  const price = toNumber(option.price);
  return (price !== null && price > 0) ? price : null;
};

/**
 * Returns the base price of a service.
 * If service has a base_price, uses that.
 * Otherwise, finds the lowest valid price among its options.
 * Returns null if no valid price found.
 */
export const getBasePrice = (service) => {
  if (!service) return null;
  
  // Try direct base_price first
  const directPrice = toNumber(service.base_price);
  if (directPrice !== null && directPrice > 0) {
      return directPrice;
  }
  
  // Fallback: Find minimum price from options
  let options = service.options;
  
  // Handle case where options might be an object (legacy map) or array
  if (options && !Array.isArray(options) && typeof options === 'object') {
    options = Object.values(options);
  }

  if (Array.isArray(options) && options.length > 0) {
    const validPrices = options
      .map(o => getOptionPrice(o))
      .filter(p => p !== null);
      
    if (validPrices.length > 0) {
        return Math.min(...validPrices);
    }
  }
  
  return null;
};

/**
 * Validates an option specifically for checkout purposes.
 * Returns validation status and the cleaned price.
 */
export const validateOptionForCheckout = (option) => {
  const price = getOptionPrice(option);
  return {
    isValid: price !== null,
    price: price
  };
};