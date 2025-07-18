/**
 * Formats a market cap value into a readable string with appropriate suffixes (K, M, B, T)
 * @param marketCap - The market cap value to format
 * @returns A formatted string representation of the market cap
 */
export const formatMarketCap = (marketCap: number, decimals: number = 1): string => {
  if (marketCap === 0) return '0';
  
  const tiers = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' }
  ];
  
  for (const { value, suffix } of tiers) {
    if (marketCap >= value) {
      return (marketCap / value).toFixed(decimals) + suffix;
    }
  }
  
  return marketCap.toFixed(0);
}; 

/**
 * Formats a date to show exact elapsed time in days, hours, minutes or seconds
 * @param dateString - The date string to format (ISO format or any format parseable by Date)
 * @returns A formatted string showing the exact elapsed time
 */
export const formatTimeElapsed = (dateString: string): string => {
  if (!dateString) return '';
  
  const createdDate = new Date(dateString);
  // Convert to client's timezone
  const createdDateInLocalTZ = new Date(createdDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
  // Check if the date is valid
  if (isNaN(createdDateInLocalTZ.getTime())) return '';
  
  const now = new Date();
  const diffInMs = now.getTime() - createdDateInLocalTZ.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `${diffInDays}d`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}m`;
  } else {
    return `${diffInSeconds}s`;
  }
}; 

/**
 * Formats very small numbers (like 1e-12) into a readable string
 * @param num - The number to format
 * @returns A formatted string representation of the small number
 */
export const formatSmallNumber = (num: number): string => {
  if (num === 0) return '0';
  if (num >= 0.0001) return num.toFixed(8);
  
  // For numbers smaller than 0.0001, use scientific notation
  const exponent = Math.floor(Math.log10(Math.abs(num)));
  const coefficient = num / Math.pow(10, exponent);
  
  // Format coefficient to 4 decimal places
  return `${coefficient.toFixed(4)}e${exponent}`;
};