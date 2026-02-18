export const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const CURRENCY_OPTIONS = ['GBP', 'EUR', 'USD'];

export const getCurrencySymbol = (currency) => {
  if (currency === 'GBP') return '£';
  if (currency === 'EUR') return '€';
  if (currency === 'USD') return '$';
  return '$';
};

export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};
