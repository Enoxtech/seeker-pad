// Launch status types
export type LaunchStatus = 'upcoming' | 'live' | 'ended'

// Launch type
export type LaunchType = 'standard' | 'elite'

// Eligibility categories for NFT
export type EligibilityCategory = 
  | 'saga-genesis' 
  | 'seeker-pioneer' 
  | 'jupiter-aligned' 
  | 'bonk-community' 
  | 'meteora-lp'

// Tier levels for staking
export type TierLevel = 'explorer' | 'pioneer' | 'visionary' | 'founder'

// Tokenomics
export interface Tokenomics {
  totalSupply: number
  initialLiquidity: number
  liquidityPercent: number
  marketingPercent: number
  teamPercent: number
  communityPercent: number
  pricePerToken: number
  raiseTarget: number
}

// Timeline
export interface Timeline {
  startTime: Date
  endTime: Date
  tgeDate: Date
  vestingStart: Date
  vestingDuration: number
  vestingCliff: number
}

// Token launch project
export interface Launch {
  id: string
  name: string
  symbol: string
  description: string
  logoUrl: string
  websiteUrl: string
  twitterUrl?: string
  telegramUrl?: string
  website?: string
  twitter?: string
  imageUrl?: string
  
  // Sale details
  type: LaunchType
  status: LaunchStatus
  
  // Tokenomics (new format)
  totalSupply: number
  initialLiquidityPercent: number
  launchPrice: number
  tokenomics?: Tokenomics
  
  // Allocation
  totalRaised: number
  hardCap: number
  minAllocation: number
  maxAllocation: number
  
  // Timing
  startTime: Date
  endTime: Date
  claimTime: Date
  timeline?: Timeline
  
  // Vesting
  vestingPeriod: number
  vestingCliff: number
  initialUnlockPercent: number
  
  // Elite specific
  eliteAllocationPercent?: number
  eliteAccessNFT?: boolean
  
  // Project team
  team?: string
  
  // Stats
  participants: number
}

// User participation in a launch
export interface Participation {
  id: string
  launchId: string
  userAddress: string
  amount: number
  tokensReceived: number
  claimedAmount: number
  claimableAmount: number
  tier: TierLevel
  isElite: boolean
  status: 'pending' | 'claimed' | 'vesting'
  createdAt: Date
  updatedAt: Date
}

// User's NFT
export interface SeekerPadNFT {
  id: string
  mintAddress: string
  ownerAddress: string
  category: EligibilityCategory
  mintDate: Date
  eliteAccess: boolean
  metadataUrl: string
}

// User's eligibility status
export interface EligibilityStatus {
  isEligible: boolean
  categories: EligibilityStatusCategory[]
  hasNFT: boolean
  nftCount: number
}

export interface EligibilityStatusCategory {
  category: EligibilityCategory
  isEligible: boolean
  balance?: number
  threshold?: number
}

// User tier info
export interface UserTier {
  level: TierLevel
  stakedAmount: number
  multiplier: number
  benefits: string[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Wallet state
export interface WalletState {
  connected: boolean
  address?: string
  balance?: number
  isEligible?: boolean
  tier?: TierLevel
}
