/**
 * Formats a number to Indonesian Rupiah currency string.
 * @param amount - The number to format
 * @returns A string in the format "Rp 1.000.000"
 */
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date string to a human-readable Indonesian format.
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
  }).format(date);
};
