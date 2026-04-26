export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';

  const strVal = String(value);
  // Replace , with nothing (thousands sep) to ensure we can parse string inputs like "1,250"
  let cleanVal = strVal.replace(/,/g, '');

  const num = parseFloat(cleanVal);

  if (isNaN(num)) return strVal;

  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatEUR = (value, decimals = 0) => {
  if (value === null || value === undefined) return '€0';

  // Using en-GB to maintain the € prefix (e.g., €500) as requested in the desired format,
  // but with 0 decimal places.
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};