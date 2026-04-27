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

export const formatPrice = (value) => {
  if (!value) return 'Price on request';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatEUR = formatPrice;