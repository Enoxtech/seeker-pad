# SeekerPad Smart Contract

Anchor-based Solana program for SeekerPad launchpad.

## Setup

```bash
cd smart-contract
npm install
```

## Build

```bash
npm run build
```

## Deploy

```bash
npm run deploy
```

## Program Accounts

### Launch
- Stores launch configuration and state
- PDA derived from mint address

### Participation
- Records user participation in launches
- Tracks claimable/claimed amounts

### Eligibility
- Verifies NFT/staking eligibility
- Categories: saga, seeker, jupiter, bonk, meteora

## Instructions

1. `initialize_launch` - Create new launch
2. `participate` - Buy tokens
3. `claim` - Claim tokens after TGE
4. `verify_eligibility` - Verify NFT/staking
5. `update_launch_status` - Update status
