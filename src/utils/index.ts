/**
 * Truncate a Solana address for display
 * @example truncateAddress("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU") => "7xKX...gAsU"
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Format SOL amount for display
 */
export function formatSOL(amount: number | bigint, decimals: number = 4): string {
  const sol = typeof amount === 'bigint' ? Number(amount) / 1e9 : amount
  return sol.toFixed(decimals)
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(targetDate: Date): string {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  
  if (diff <= 0) return 'Started'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
