use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("SeekPad1111111111111111111111111111111");

// ============ ACCOUNTS ============

#[account]
#[derive(Default)]
pub struct Launch {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub usdc_vault: Pubkey,
    pub usdc_mint: Pubkey,
    pub price_per_token: u64,
    pub price_per_token_usdc: u64,
    pub raise_target: u64,
    pub total_raised_sol: u64,
    pub total_raised_usdc: u64,
    pub min_allocation: u64,
    pub max_allocation: u64,
    // Tier-specific allocations
    pub jupiter_max_allocation: u64,
    pub seeker_max_allocation: u64,
    pub penguin_max_allocation: u64,
    pub public_max_allocation: u64,
    // Timing
    pub start_time: i64,
    pub end_time: i64,
    pub tge_time: i64,
    // Cliff & Vesting
    pub cliff_duration: i64,      // Seconds from TGE until first claim
    pub vesting_duration: i64,     // Total vesting period after cliff
    pub vesting_type: u8,          // 0 = immediate, 1 = cliff, 2 = linear
    pub status: u8,
    pub launch_type: u8,
    pub funds_withdrawn: bool,
    pub bump: u8,
}

#[account]
#[derive(Default)]
pub struct Participation {
    pub user: Pubkey,
    pub launch: Pubkey,
    pub tier: u8,                  // 0 = None, 1 = Jupiter, 2 = Seeker, 3 = Penguin, 4 = Public
    pub amount_sol: u64,
    pub amount_usdc: u64,
    pub tokens_received: u64,
    pub claimed: bool,
    pub claimable_amount: u64,
    pub claimed_amount: u64,
    // Vesting tracking
    pub last_claim_time: i64,
    pub total_vested: u64,
    pub bump: u8,
}

#[account]
#[derive(Default)]
pub struct WhitelistEntry {
    pub user: Pubkey,
    pub launch: Pubkey,
    pub tier: u8,                  // 1 = Jupiter, 2 = Seeker, 3 = Penguin
    pub max_allocation: u64,
    pub bump: u8,
}

// ============ CONTEXTS ============

#[derive(Accounts)]
pub struct InitializeLaunch<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 360,
        seeds = [b"launch", mint.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, Launch>,
    pub mint: AccountInfo<'info>,
    pub usdc_mint: AccountInfo<'info>,
    #[account(
        init,
        payer = authority,
        seeds = [b"vault", mint.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        init,
        payer = authority,
        seeds = [b"usdc_vault", mint.key().as_ref()],
        bump,
        associated_token::mint = usdc_mint,
        associated_token::authority = authority
    )]
    pub usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ParticipateSol<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(
        init,
        payer = user,
        space = 8 + 176,
        seeds = [b"participation", user.key().as_ref(), launch.key().as_ref()],
        bump
    )]
    pub participation: Account<'info, Participation>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ParticipateUsdc<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(
        init,
        payer = user,
        space = 8 + 176,
        seeds = [b"participation", user.key().as_ref(), launch.key().as_ref()],
        bump
    )]
    pub participation: Account<'info, Participation>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"user_usdc", user.key().as_ref(), launch.key().as_ref()],
        bump,
        associated_token::mint = launch.usdc_mint,
        associated_token::authority = user
    )]
    pub user_usdc_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"usdc_vault", launch.mint.as_ref()],
        bump = launch.bump,
        associated_token::mint = launch.usdc_mint,
        associated_token::authority = launch.authority
    )]
    pub usdc_vault: Account<'info, TokenAccount>,
    pub launch_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub participation: Account<'info, Participation>,
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", launch.mint.as_ref()],
        bump = launch.bump
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub authority_sol_account: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddToWhitelist<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 82,
        seeds = [b"whitelist", user.key().as_ref(), launch.key().as_ref()],
        bump
    )]
    pub whitelist_entry: Account<'info, WhitelistEntry>,
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateStatus<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    pub authority: Signer<'info>,
}

// ============ FUNCTIONS ============

pub fn initialize_launch(
    ctx: Context<InitializeLaunch>,
    price_per_token: u64,
    price_per_token_usdc: u64,
    raise_target: u64,
    min_allocation: u64,
    max_allocation: u64,
    // Tier allocations
    jupiter_max_allocation: u64,
    seeker_max_allocation: u64,
    penguin_max_allocation: u64,
    public_max_allocation: u64,
    // Timing
    start_time: i64,
    end_time: i64,
    tge_time: i64,
    // Vesting
    cliff_duration: i64,
    vesting_duration: i64,
    vesting_type: u8,
    launch_type: u8,
) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    launch.authority = ctx.accounts.authority.key();
    launch.mint = ctx.accounts.mint.key();
    launch.vault = ctx.accounts.vault.key();
    launch.usdc_vault = ctx.accounts.usdc_vault.key();
    launch.usdc_mint = ctx.accounts.usdc_mint.key();
    launch.price_per_token = price_per_token;
    launch.price_per_token_usdc = price_per_token_usdc;
    launch.raise_target = raise_target;
    launch.total_raised_sol = 0;
    launch.total_raised_usdc = 0;
    launch.min_allocation = min_allocation;
    launch.max_allocation = max_allocation;
    
    // Tier allocations
    launch.jupiter_max_allocation = jupiter_max_allocation;
    launch.seeker_max_allocation = seeker_max_allocation;
    launch.penguin_max_allocation = penguin_max_allocation;
    launch.public_max_allocation = public_max_allocation;
    
    // Timing
    launch.start_time = start_time;
    launch.end_time = end_time;
    launch.tge_time = tge_time;
    
    // Vesting
    launch.cliff_duration = cliff_duration;
    launch.vesting_duration = vesting_duration;
    launch.vesting_type = vesting_type;
    
    launch.status = 0;
    launch.launch_type = launch_type;
    launch.funds_withdrawn = false;
    launch.bump = ctx.bumps.launch;

    emit!(LaunchInitialized {
        authority: launch.authority,
        mint: launch.mint,
        price_per_token,
        price_per_token_usdc,
        start_time,
        end_time,
    });

    msg!("Launch initialized: {}", launch.key());
    Ok(())
}

pub fn participate_sol(ctx: Context<ParticipateSol>, amount: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let participation = &mut ctx.accounts.participation;

    // Check launch is live
    if launch.status != 1 {
        return Err(ErrorCode::LaunchNotLive.into());
    }
    
    let clock = clock::Clock::get()?.unix_timestamp;
    if clock < launch.start_time {
        return Err(ErrorCode::NotStarted.into());
    }
    if clock > launch.end_time {
        return Err(ErrorCode::Ended.into());
    }

    // Determine user's tier and max allocation
    let user_tier = get_user_tier(&ctx.accounts.user.key(), &launch.key())?;
    let max_allowed = get_tier_max_allocation(launch, user_tier);
    
    // Check allocation
    let total_user_allocation = participation.amount_sol.saturating_add(amount);
    if total_user_allocation > max_allowed {
        return Err(ErrorCode::AboveMaxAllocation.into());
    }
    if amount < launch.min_allocation {
        return Err(ErrorCode::BelowMinAllocation.into());
    }

    // Transfer SOL
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        },
    );
    anchor_lang::system_program::transfer(cpi_context, amount)?;

    // Calculate tokens
    let tokens_received = (amount * 1_000_000_000) / launch.price_per_token;
    
    // Set up participation
    participation.user = ctx.accounts.user.key();
    participation.launch = launch.key();
    participation.tier = user_tier;
    participation.amount_sol = amount;
    participation.amount_usdc = 0;
    participation.tokens_received = tokens_received;
    participation.claimed = false;
    participation.claimable_amount = tokens_received;
    participation.claimed_amount = 0;
    participation.last_claim_time = 0;
    participation.total_vested = 0;
    participation.bump = ctx.bumps.participation;

    launch.total_raised_sol = launch.total_raised_sol.checked_add(amount).unwrap();

    emit!(UserParticipated {
        user: ctx.accounts.user.key(),
        tier: user_tier,
        amount_sol: amount,
        amount_usdc: 0,
        tokens_received,
    });

    msg!("User {} participated with {} SOL (Tier: {})", ctx.accounts.user.key(), amount, user_tier);
    Ok(())
}

pub fn participate_usdc(ctx: Context<ParticipateUsdc>, amount: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let participation = &mut ctx.accounts.participation;

    // Check launch is live
    if launch.status != 1 {
        return Err(ErrorCode::LaunchNotLive.into());
    }
    
    let clock = clock::Clock::get()?.unix_timestamp;
    if clock < launch.start_time {
        return Err(ErrorCode::NotStarted.into());
    }
    if clock > launch.end_time {
        return Err(ErrorCode::Ended.into());
    }

    // Determine user's tier
    let user_tier = get_user_tier(&ctx.accounts.user.key(), &launch.key())?;
    let max_allowed = get_tier_max_allocation(launch, user_tier);
    
    // Check allocation
    let total_user_allocation = participation.amount_usdc.saturating_add(amount);
    if total_user_allocation > max_allowed {
        return Err(ErrorCode::AboveMaxAllocation.into());
    }
    if amount < launch.min_allocation {
        return Err(ErrorCode::BelowMinAllocation.into());
    }

    // Transfer USDC
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_usdc_account.to_account_info(),
            to: ctx.accounts.usdc_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(cpi_context, amount)?;

    // Calculate tokens
    let tokens_received = (amount * 1_000_000) / launch.price_per_token_usdc;
    
    // Set up participation
    participation.user = ctx.accounts.user.key();
    participation.launch = launch.key();
    participation.tier = user_tier;
    participation.amount_sol = 0;
    participation.amount_usdc = amount;
    participation.tokens_received = tokens_received;
    participation.claimed = false;
    participation.claimable_amount = tokens_received;
    participation.claimed_amount = 0;
    participation.last_claim_time = 0;
    participation.total_vested = 0;
    participation.bump = ctx.bumps.participation;

    launch.total_raised_usdc = launch.total_raised_usdc.checked_add(amount).unwrap();

    emit!(UserParticipated {
        user: ctx.accounts.user.key(),
        tier: user_tier,
        amount_sol: 0,
        amount_usdc: amount,
        tokens_received,
    });

    msg!("User {} participated with {} USDC (Tier: {})", ctx.accounts.user.key(), amount, user_tier);
    Ok(())
}

pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
    let participation = &mut ctx.accounts.participation;
    let launch = &mut ctx.accounts.launch;

    let clock = clock::Clock::get()?.unix_timestamp;
    
    // Check TGE reached
    if clock < launch.tge_time {
        return Err(ErrorCode::TGENotReached.into());
    }

    // Calculate claimable based on vesting type
    let claimable = calculate_claimable(launch, participation, clock)?;
    
    if claimable == 0 {
        return Err(ErrorCode::NothingToClaim.into());
    }

    // Transfer tokens
    let seeds = &[&[b"launch", launch.mint.as_ref(), &[launch.bump]][..]];
    let signer = &[&seeds[..]];

    anchor_lang::system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            signer,
        ),
        claimable,
    )?;

    // Update participation
    participation.claimed_amount = participation.claimed_amount.saturating_add(claimable);
    participation.last_claim_time = clock;
    participation.total_vested = participation.total_vested.saturating_add(claimable);
    
    // Mark as fully claimed if all tokens vested
    if participation.claimed_amount >= participation.tokens_received {
        participation.claimed = true;
    }

    emit!(TokensClaimed {
        user: ctx.accounts.user.key(),
        amount: claimable,
        total_claimed: participation.claimed_amount,
    });

    msg!("User {} claimed {} tokens (total: {})", ctx.accounts.user.key(), claimable, participation.claimed_amount);
    Ok(())
}

pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    
    if ctx.accounts.authority.key() != launch.authority {
        return Err(ErrorCode::Unauthorized.into());
    }
    if launch.funds_withdrawn {
        return Err(ErrorCode::FundsAlreadyWithdrawn.into());
    }

    let vault_balance = ctx.accounts.vault.to_account_info().lamports();
    if vault_balance > 0 {
        **ctx.accounts.authority_sol_account.lamports.borrow_mut() += vault_balance;
        **ctx.accounts.vault.to_account_info().lamports.borrow_mut() = 0;
    }

    launch.funds_withdrawn = true;

    emit!(FundsWithdrawn {
        authority: launch.authority,
        total_sol: launch.total_raised_sol,
        total_usdc: launch.total_raised_usdc,
    });

    msg!("Funds withdrawn by {}", launch.authority);
    Ok(())
}

pub fn add_to_whitelist(ctx: Context<AddToWhitelist>, tier: u8, max_allocation: u64) -> Result<()> {
    if tier < 1 || tier > 3 {
        return Err(ErrorCode::InvalidTier.into());
    }
    
    let whitelist = &mut ctx.accounts.whitelist_entry;
    whitelist.user = ctx.accounts.user.key();
    whitelist.launch = ctx.accounts.launch.key();
    whitelist.tier = tier;
    whitelist.max_allocation = max_allocation;
    whitelist.bump = ctx.bumps.whitelist_entry;

    emit!(WhitelistAdded {
        user: ctx.accounts.user.key(),
        tier,
        max_allocation,
    });

    msg!("User {} added to whitelist with tier {}", ctx.accounts.user.key(), tier);
    Ok(())
}

pub fn update_launch_status(ctx: Context<UpdateStatus>, new_status: u8) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    if ctx.accounts.authority.key() != launch.authority {
        return Err(ErrorCode::Unauthorized.into());
    }
    launch.status = new_status;

    emit!(StatusUpdated {
        launch: launch.key(),
        status: new_status,
    });

    msg!("Launch status updated to: {}", new_status);
    Ok(())
}

// ============ HELPER FUNCTIONS ============

fn get_user_tier(user: &Pubkey, launch: &Pubkey) -> Result<u8> {
    // This would need to check if user is in whitelist
    // For now, return public tier (4)
    // In production, you'd fetch the WhitelistEntry account
    Ok(4) // Public tier
}

fn get_tier_max_allocation(launch: &Launch, tier: u8) -> u64 {
    match tier {
        1 => launch.jupiter_max_allocation,  // Jupiter
        2 => launch.seeker_max_allocation,   // Seeker  
        3 => launch.penguin_max_allocation, // Penguin
        _ => launch.public_max_allocation,   // Public / None
    }
}

fn calculate_claimable(launch: &Launch, participation: &Participation, current_time: i64) -> Result<u64> {
    let total_tokens = participation.tokens_received;
    let already_claimed = participation.claimed_amount;
    let remaining = total_tokens.saturating_sub(already_claimed);
    
    if remaining == 0 {
        return Ok(0);
    }

    // Vesting type: 0 = immediate (no vesting), 1 = cliff, 2 = linear
    match launch.vesting_type {
        0 => {
            // Immediate - claim all at once (if not already claimed)
            if participation.claimed {
                return Ok(0);
            }
            Ok(remaining)
        }
        1 => {
            // Cliff - can only claim after cliff period
            let cliff_end = launch.tge_time.saturating_add(launch.cliff_duration);
            if current_time < cliff_end {
                return Err(ErrorCode::CliffNotEnded.into());
            }
            // After cliff, can claim all
            if participation.claimed {
                return Ok(0);
            }
            Ok(remaining)
        }
        2 => {
            // Linear vesting
            let cliff_end = launch.tge_time.saturating_add(launch.cliff_duration);
            if current_time < cliff_end {
                return Err(ErrorCode::CliffNotEnded.into());
            }
            
            let vesting_end = cliff_end.saturating_add(launch.vesting_duration);
            let now = if current_time > vesting_end { vesting_end } else { current_time };
            
            let time_in_vesting = now.saturating_sub(cliff_end);
            let total_vesting_time = launch.vesting_duration;
            
            if total_vesting_time == 0 {
                return Ok(remaining);
            }
            
            let vested_percentage = (time_in_vesting as u128 * 10000 / total_vesting_time as u128) as u64;
            let total_vested = (total_tokens as u128 * vested_percentage as u128 / 10000) as u64;
            
            let claimable = total_vested.saturating_sub(participation.total_vested);
            Ok(claimable.min(remaining))
        }
        _ => Ok(remaining),
    }
}

// ============ EVENTS ============

#[event]
pub struct LaunchInitialized {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub price_per_token: u64,
    pub price_per_token_usdc: u64,
    pub start_time: i64,
    pub end_time: i64,
}

#[event]
pub struct UserParticipated {
    pub user: Pubkey,
    pub tier: u8,
    pub amount_sol: u64,
    pub amount_usdc: u64,
    pub tokens_received: u64,
}

#[event]
pub struct TokensClaimed {
    pub user: Pubkey,
    pub amount: u64,
    pub total_claimed: u64,
}

#[event]
pub struct FundsWithdrawn {
    pub authority: Pubkey,
    pub total_sol: u64,
    pub total_usdc: u64,
}

#[event]
pub struct WhitelistAdded {
    pub user: Pubkey,
    pub tier: u8,
    pub max_allocation: u64,
}

#[event]
pub struct StatusUpdated {
    pub launch: Pubkey,
    pub status: u8,
}

// ============ ERROR CODES ============

#[derive(Debug, Clone, PartialEq)]
pub enum ErrorCode {
    #[msg("Launch is not live")]
    LaunchNotLive,
    #[msg("Launch has not started")]
    NotStarted,
    #[msg("Launch has ended")]
    Ended,
    #[msg("Below minimum allocation")]
    BelowMinAllocation,
    #[msg("Above maximum allocation")]
    AboveMaxAllocation,
    #[msg("TGE not yet reached")]
    TGENotReached,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Funds already withdrawn")]
    FundsAlreadyWithdrawn,
    #[msg("Invalid tier")]
    InvalidTier,
    #[msg("Cliff period not ended")]
    CliffNotEnded,
    #[msg("Nothing to claim")]
    NothingToClaim,
}