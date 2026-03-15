# SeekerPad Smart Contract Deployment Guide

## Overview
This guide covers deploying both the IDO contract and setting up NFT drops.

---

## Part 1: IDO Token Launch Contract

### Prerequisites
1. **Install Anchor & Rust**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   cargo install anchor-cli --locked
   ```

2. **Configure Solana CLI**
   ```bash
   solana config set --url devnet  # or mainnet
   solana-keygen new  # create wallet if needed
   ```

### Step 1: Build the Contract
```bash
cd smart-contract
anchor build
```

### Step 2: Deploy to Devnet (Testing)
```bash
anchor deploy --provider.cluster devnet
```

This will output a program ID. Update `lib.rs` with the new ID if needed.

### Step 3: Initialize the Program
Create a script to initialize a launch:
```typescript
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, Keypair } from '@solana/web3.js';

const programId = new web3.PublicKey('SeekPad1111111111111111111111111111111');

async function initializeLaunch() {
  // Parameters
  const pricePerToken = 1000000; // 0.001 SOL per token
  const pricePerTokenUsdc = 1000; // 0.001 USDC per token (USDC has 6 decimals)
  const raiseTarget = 100 * 1e9; // 100 SOL
  const minAllocation = 0.1 * 1e9; // 0.1 SOL
  const maxAllocation = 10 * 1e9; // 10 SOL
  const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  const endTime = startTime + 7 * 24 * 3600; // 7 days
  const tgeTime = endTime; // Tokens available after launch ends

  // Call initialize_launch instruction
  const tx = await program.methods
    .initializeLaunch(
      new BN(pricePerToken),
      new BN(pricePerTokenUsdc),
      new BN(raiseTarget),
      new BN(minAllocation),
      new BN(maxAllocation),
      new BN(startTime),
      new BN(endTime),
      new BN(tgeTime),
      0 // launch_type: 0 = public
    )
    .accounts({
      mint: tokenMint,
      usdcMint: usdcMint,
    })
    .rpc();

  console.log('Launch initialized:', tx);
}
```

### Step 4: Deploy to Mainnet
```bash
# Switch to mainnet
solana config set --url mainnet

# Build and deploy
anchor build
anchor deploy --provider.cluster mainnet
```

---

## Part 2: NFT Drops (Candy Machine)

### Option A: Metaplex Candy Machine v3 (Recommended)

#### Step 1: Install Metaplex CLI
```bash
npm install -g @metaplex/js
```

#### Step 2: Create Collection
```bash
# Create a new collection NFT
metaplex mintNFT \
  --rpc-url https://api.mainnet-beta.solana.com \
  --keypair ~/.config/solana/id.json \
  --uri "https://your-metadata-uri.json" \
  --max-supply 1
```

#### Step 3: Create Candy Machine
```bash
metaplex createCandyMachine \
  --rpc-url https://api.mainnet-beta.solana.com \
  --keypair ~/.config/solana/id.json \
  --price 1 \
  --item-price 0 \
  --metadata-uri "https://your-collection-uri/" \
  --number 1000
```

#### Step 4: Set Whitelist (For Eligible Users)
```typescript
// Add users to whitelist
const mintAddress = candyMachine.address;
const whitelistNftMint = new PublicKey('...');

await metaplex.candyMachines().insertItems({
  candyMachine: candyMachine.address,
  items: [
    { name: "NFT #1", uri: "https://..." },
    // ... more items
  ]
});
```

### Option B: Using Sugar CLI (Faster)
```bash
# Install Sugar
cargo install sugar-cli

# Create config
sugar init

# Edit config.json with your settings
sugar upload
sugar deploy
```

---

## Part 3: Integration with Frontend

### Environment Variables
Add to Vercel dashboard:
```
NEXT_PUBLIC_CONTRACT_MODE=custom
NEXT_PUBLIC_IDO_PROGRAM_ID=SeekPad1111111111111111111111111111111
NEXT_PUBLIC_CANDY_MACHINE_ID=YourCandyMachineId
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSBcXptNSx3wcgNCiuCZsUjDaB2cZ8B
```

### Frontend Integration
```typescript
// Token purchase
import { Program } from '@project-serum/anchor';

// For SOL payment
await program.methods
  .participateSol(new BN(amountLamports))
  .accounts({
    launch: launchAddress,
    vault: launch.vault,
  })
  .rpc();

// For USDC payment
await program.methods
  .participateUsdc(new BN(amountUSDC))
  .accounts({
    launch: launchAddress,
    userUsdcAccount: userUsdcAta,
    usdcVault: launch.usdcVault,
  })
  .rpc();
```

---

## Security Considerations

1. **Multisig for Fund Releases**
   - Consider using a multisig wallet (Goki/Realms) for fund withdrawals
   - Set up milestone-based releases

2. **Rate Limiting**
   - Add max per-user limits in contract

3. **Emergency Withdrawal**
   - Add admin emergency withdraw function

4. **Audit**
   - Get professional audit before mainnet launch with real funds

---

## Quick Deploy Commands

### Devnet
```bash
cd smart-contract
solana config set --url devnet
anchor build
anchor deploy
```

### Mainnet
```bash
cd smart-contract
solana config set --url mainnet
anchor build
anchor deploy --provider.cluster mainnet
```

---

## Troubleshooting

**Build errors:**
```bash
# Clean and rebuild
anchor clean
anchor build
```

**Deployment fails:**
```bash
# Check balance
solana balance

# Airdrop if needed (devnet only)
solana airdrop 2
```

**Program ID mismatch:**
- Update `Anchor.toml` with new program ID
- Run `anchor build` again