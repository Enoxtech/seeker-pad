// Contract Configuration
// Use this to switch between IDO providers and custom contracts

export type ContractMode = 'demo' | 'preset' | 'custom'

export interface ContractConfig {
  mode: ContractMode
  presetIdo?: 'raydium' | 'solanium' | 'duckstarter'
  customAddress?: string
}

// Get contract configuration from environment
export function getContractConfig(): ContractConfig {
  if (typeof window === 'undefined') {
    return { mode: 'demo' }
  }

  const mode = (process.env.NEXT_PUBLIC_CONTRACT_MODE as ContractMode) || 'demo'
  
  if (mode === 'preset') {
    return {
      mode: 'preset',
      presetIdo: (process.env.NEXT_PUBLIC_PRESET_IDO as any) || 'raydium'
    }
  }
  
  if (mode === 'custom') {
    return {
      mode: 'custom',
      customAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    }
  }
  
  return { mode: 'demo' }
}

// Preset IDO contract addresses (mainnet)
export const PRESET_CONTRACTS: Record<string, string> = {
  raydium: 'CVzwpzVzD3rJ5b7y9R1Z8kF5YvX3mN4pQ6rT8sU2vW0Y',
  solanium: 'Gx4pY9kF2vW8rT3mN6pQ0zX5cY7sU1vW9Y4pR6tB8xA3',
  duckstarter: 'Df5R9mN8pT3vX7yA6cW4sU2tB9xY0pQ6rM8kF5vW3nP1'
}

// Check if we're in demo mode
export function isDemoMode(): boolean {
  return getContractConfig().mode === 'demo'
}

// Get the vault address to use for transactions
export function getVaultAddress(): string {
  const config = getContractConfig()
  
  if (config.mode === 'custom' && config.customAddress) {
    return config.customAddress
  }
  
  if (config.mode === 'preset' && config.presetIdo && PRESET_CONTRACTS[config.presetIdo]) {
    return PRESET_CONTRACTS[config.presetIdo]
  }
  
  // Demo mode - use mock vault
  return 'Gq3q3J7L9m8V6F5qK2p4R8t3Y1n6B7c4D6e9F3g2H1k5'
}