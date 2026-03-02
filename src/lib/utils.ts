/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format SOL or token amount with decimals
 */
export function formatAmount(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals);
}

/**
 * Format currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "in 2 days", "3 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `in ${minutes} min`;
  if (seconds > 0) return `in ${seconds}s`;
  
  const pastSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  const pastMinutes = Math.floor(pastSeconds / 60);
  const pastHours = Math.floor(pastMinutes / 60);
  const pastDays = Math.floor(pastHours / 24);
  
  if (pastDays > 0) return `${pastDays}d ago`;
  if (pastHours > 0) return `${pastHours}h ago`;
  if (pastMinutes > 0) return `${pastMinutes}m ago`;
  return 'just now';
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, startChars: number = 4, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Calculate token amount from SOL input
 */
export function calculateTokenAmount(solAmount: number, pricePerToken: number): number {
  return solAmount / pricePerToken;
}

/**
 * Calculate SOL needed for token amount
 */
export function calculateSolAmount(tokenAmount: number, pricePerToken: number): number {
  return tokenAmount * pricePerToken;
}

/**
 * Get status color class
 */
export function getStatusColor(status: 'upcoming' | 'live' | 'ended'): string {
  switch (status) {
    case 'live':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'ended':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Validate SOL address
 */
export function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}
