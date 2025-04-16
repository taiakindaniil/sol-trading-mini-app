/**
 * Formats a market cap value into a readable string with appropriate suffixes (K, M, B, T)
 * @param marketCap - The market cap value to format
 * @returns A formatted string representation of the market cap
 */
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap === 0) return '0';
  
  const tiers = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' }
  ];
  
  for (const { value, suffix } of tiers) {
    if (marketCap >= value) {
      return (marketCap / value).toFixed(1) + suffix;
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
  // Check if the date is valid
  if (isNaN(createdDate.getTime())) return '';
  
  const now = new Date();
  const diffInMs = now.getTime() - createdDate.getTime();
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