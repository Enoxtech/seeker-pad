import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, TokenProgram } from '@solana/web3.js';
import { Token } from '@solana/spl-token';

const LAUNCHPAD_PROGRAM_ID = new PublicKey('SeekPad1111111111111111111111111111111');

export { LAUNCHPAD_PROGRAM_ID };

// Launch account sizes
export const LAUNCH_SIZE = 208;
export const PARTICIPATION_SIZE = 128;
export const ELIGIBILITY_SIZE = 66;

// Find launch PDA
export function findLaunchAddress(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddress(
    [Buffer.from('launch'), mint.toBuffer()],
    LAUNCHPAD_PROGRAM_ID
  );
}

// Find participation PDA
export function findParticipationAddress(
  user: PublicKey,
  launch: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddress(
    [Buffer.from('participation'), user.toBuffer(), launch.toBuffer()],
    LAUNCHPAD_PROGRAM_ID
  );
}

// Find eligibility PDA
export function findEligibilityAddress(
  user: PublicKey,
  category: number
): [PublicKey, number] {
  return PublicKey.findProgramAddress(
    [Buffer.from('eligibility'), user.toBuffer(), Buffer.from([category])],
    LAUNCHPAD_PROGRAM_ID
  );
}

// Get provider
export function getProvider(connection: Connection, wallet: anchor.Wallet) {
  return new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
}

// Initialize launch (admin function)
export async function initializeLaunch(
  program: anchor.Program,
  mint: PublicKey,
  pricePerToken: number,
  raiseTarget: number,
  minAllocation: number,
  maxAllocation: number,
  startTime: number,
  endTime: number,
  tgeTime: number,
  isElite: boolean
) {
  const [launch] = await findLaunchAddress(mint);
  const [vault] = PublicKey.findProgramAddress(
    [Buffer.from('vault'), mint.toBuffer()],
    LAUNCHPAD_PROGRAM_ID
  );
  const [usdcVault] = PublicKey.findProgramAddress(
    [Buffer.from('usdc_vault'), mint.toBuffer()],
    LAUNCHPAD_PROGRAM_ID
  );

  const tx = await program.rpc.initializeLaunch(
    new anchor.BN(pricePerToken),
    new anchor.BN(raiseTarget),
    new anchor.BN(minAllocation),
    new anchor.BN(maxAllocation),
    new anchor.BN(startTime),
    new anchor.BN(endTime),
    new anchor.BN(tgeTime),
    isElite ? 1 : 0,
    {
      accounts: {
        launch,
        mint,
        vault,
        usdcVault,
        authority: program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    }
  );

  return { tx, launch, vault, usdcVault };
}

// Participate in a launch
export async function participate(
  program: anchor.Program,
  launch: PublicKey,
  amount: number // in SOL lamports
) {
  const user = program.provider.wallet.publicKey;
  const [participation] = await findParticipationAddress(user, launch);

  const launchAccount = await program.account.launch.fetch(launch);
  
  // Get vault
  const [vault] = PublicKey.findProgramAddress(
    [Buffer.from('launch'), launchAccount.mint.toBuffer()],
    LAUNCHPAD_PROGRAM_ID
  );

  const tx = await program.rpc.participate(new anchor.BN(amount), {
    accounts: {
      user,
      launch,
      participation,
      vault,
      systemProgram: SystemProgram.programId,
    },
    instructions: [
      SystemProgram.transfer({
        fromPubkey: user,
        toPubkey: vault,
        lamports: amount,
      }),
    ],
  });

  return { tx, participation };
}

// Claim tokens
export async function claimTokens(
  program: anchor.Program,
  launch: PublicKey,
  userTokenAccount: PublicKey
) {
  const user = program.provider.wallet.publicKey;
  const [participation] = await findParticipationAddress(user, launch);

  const tx = await program.rpc.claim({
    accounts: {
      user,
      participation,
      launch,
      userTokenAccount,
      tokenProgram: TokenProgram.programId,
    },
  });

  return { tx };
}

// Verify eligibility
export async function verifyEligibility(
  program: anchor.Program,
  category: number // 0: saga, 1: seeker, 2: jupiter, 3: bonk, 4: meteora
) {
  const user = program.provider.wallet.publicKey;
  const [eligibility] = await findEligibilityAddress(user, category);

  const tx = await program.rpc.verifyEligibility(category, {
    accounts: {
      user,
      eligibility,
      systemProgram: SystemProgram.programId,
    },
  });

  return { tx, eligibility };
}

// Update launch status
export async function updateLaunchStatus(
  program: anchor.Program,
  launch: PublicKey,
  status: number // 0: upcoming, 1: live, 2: ended
) {
  const tx = await program.rpc.updateLaunchStatus(status, {
    accounts: {
      launch,
      authority: program.provider.wallet.publicKey,
    },
  });

  return { tx };
}

// Fetch launch data
export async function getLaunch(program: anchor.Program, launch: PublicKey) {
  return program.account.launch.fetch(launch);
}

// Fetch participation
export async function getParticipation(
  program: anchor.Program,
  participation: PublicKey
) {
  return program.account.participation.fetch(participation);
}

// Fetch user's participation for a launch
export async function getUserParticipation(
  program: anchor.Program,
  launch: PublicKey
) {
  const user = program.provider.wallet.publicKey;
  const [participation] = await findParticipationAddress(user, launch);

  try {
    return await program.account.participation.fetch(participation);
  } catch {
    return null;
  }
}
