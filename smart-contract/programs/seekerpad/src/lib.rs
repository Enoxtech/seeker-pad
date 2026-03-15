use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("SeekPad1111111111111111111111111111111");

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
    pub start_time: i64,
    pub end_time: i64,
    pub tge_time: i64,
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
    pub amount_sol: u64,
    pub amount_usdc: u64,
    pub tokens_received: u64,
    pub claimed: bool,
    pub claimable_amount: u64,
    pub claimed_amount: u64,
    pub bump: u8,
}

#[account]
#[derive(Default)]
pub struct WhitelistEntry {
    pub user: Pubkey,
    pub launch: Pubkey,
    pub max_allocation: u64,
    pub bump: u8,
}

// Initialize launch
#[derive(Accounts)]
pub struct InitializeLaunch<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 272,
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

// Participate with SOL
#[derive(Accounts)]
pub struct ParticipateSol<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(
        init,
        payer = user,
        space = 8 + 152,
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

// Participate with USDC
#[derive(Accounts)]
pub struct ParticipateUsdc<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(
        init,
        payer = user,
        space = 8 + 152,
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

// Claim tokens
#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub participation: Account<'info, Participation>,
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"user_token", user.key().as_ref(), launch.mint.as_ref()],
        bump,
        associated_token::mint = launch.mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"vault", launch.mint.as_ref()],
        bump = launch.bump
    )]
    pub vault: SystemAccount<'info>,
    pub mint: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Withdraw funds (authority only)
#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub authority_sol_account: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"usdc_vault", launch.mint.as_ref()],
        bump = launch.bump,
        associated_token::mint = launch.usdc_mint,
        associated_token::authority = launch.authority
    )]
    pub usdc_vault: Account<'info, TokenAccount>,
    #[account(
        mut,
        address = launch.usdc_vault
    )]
    pub usdc_vault_system: SystemAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// Add to whitelist
#[derive(Accounts)]
pub struct AddToWhitelist<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 66,
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

// Update launch status
#[derive(Accounts)]
pub struct UpdateStatus<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    pub authority: Signer<'info>,
}

// ============ INSTRUCTIONS ============

pub fn initialize_launch(
    ctx: Context<InitializeLaunch>,
    price_per_token: u64,
    price_per_token_usdc: u64,
    raise_target: u64,
    min_allocation: u64,
    max_allocation: i64,
    start_time: i64,
    end_time: i64,
    tge_time: i64,
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
    launch.max_allocation = max_allocation as u64;
    launch.start_time = start_time;
    launch.end_time = end_time;
    launch.tge_time = tge_time;
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

    require!(launch.status == 1, ErrorCode::LaunchNotLive);
    require!(clock::Clock::get()?.unix_timestamp >= launch.start_time, ErrorCode::NotStarted);
    require!(clock::Clock::get()?.unix_timestamp <= launch.end_time, ErrorCode::Ended);
    require!(amount >= launch.min_allocation, ErrorCode::BelowMinAllocation);
    require!(amount <= launch.max_allocation, ErrorCode::AboveMaxAllocation);

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        },
    );
    anchor_lang::system_program::transfer(cpi_context, amount)?;

    let tokens_received = (amount * 1_000_000_000) / launch.price_per_token;
    
    participation.user = ctx.accounts.user.key();
    participation.launch = launch.key();
    participation.amount_sol = amount;
    participation.amount_usdc = 0;
    participation.tokens_received = tokens_received;
    participation.claimed = false;
    participation.claimable_amount = tokens_received;
    participation.claimed_amount = 0;
    participation.bump = ctx.bumps.participation;

    launch.total_raised_sol = launch.total_raised_sol.checked_add(amount).unwrap();

    emit!(UserParticipated {
        user: ctx.accounts.user.key(),
        amount_sol: amount,
        tokens_received,
    });

    msg!("User {} participated with {} SOL", ctx.accounts.user.key(), amount);
    Ok(())
}

pub fn participate_usdc(ctx: Context<ParticipateUsdc>, amount: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let participation = &mut ctx.accounts.participation;

    require!(launch.status == 1, ErrorCode::LaunchNotLive);
    require!(clock::Clock::get()?.unix_timestamp >= launch.start_time, ErrorCode::NotStarted);
    require!(clock::Clock::get()?.unix_timestamp <= launch.end_time, ErrorCode::Ended);
    require!(amount >= launch.min_allocation, ErrorCode::BelowMinAllocation);
    require!(amount <= launch.max_allocation, ErrorCode::AboveMaxAllocation);

    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_usdc_account.to_account_info(),
            to: ctx.accounts.usdc_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(cpi_context, amount)?;

    let tokens_received = (amount * 1_000_000) / launch.price_per_token_usdc;
    
    participation.user = ctx.accounts.user.key();
    participation.launch = launch.key();
    participation.amount_sol = 0;
    participation.amount_usdc = amount;
    participation.tokens_received = tokens_received;
    participation.claimed = false;
    participation.claimable_amount = tokens_received;
    participation.claimed_amount = 0;
    participation.bump = ctx.bumps.participation;

    launch.total_raised_usdc = launch.total_raised_usdc.checked_add(amount).unwrap();

    emit!(UserParticipated {
        user: ctx.accounts.user.key(),
        amount_usdc: amount,
        tokens_received,
    });

    msg!("User {} participated with {} USDC", ctx.accounts.user.key(), amount);
    Ok(())
}

pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
    let participation = &mut ctx.accounts.participation;
    let launch = &mut ctx.accounts.launch;

    let clock = clock::Clock::get()?;
    require!(clock.unix_timestamp >= launch.tge_time, ErrorCode::TGENotReached);
    require!(!participation.claimed, ErrorCode::AlreadyClaimed);

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
        participation.claimable_amount,
    )?;

    participation.claimed = true;
    participation.claimed_amount = participation.claimable_amount;
    participation.claimable_amount = 0;

    emit!(TokensClaimed {
        user: ctx.accounts.user.key(),
        amount: participation.claimed_amount,
    });

    msg!("User {} claimed {} tokens", ctx.accounts.user.key(), participation.claimed_amount);
    Ok(())
}

pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    
    require!(ctx.accounts.authority.key() == launch.authority, ErrorCode::Unauthorized);
    require!(!launch.funds_withdrawn, ErrorCode::FundsAlreadyWithdrawn);

    let vault_balance = ctx.accounts.launch.to_account_info().lamports();
    if vault_balance > 0 {
        **ctx.accounts.authority_sol_account.lamports.borrow_mut() += vault_balance;
        **ctx.accounts.launch.to_account_info().lamports.borrow_mut() = 0;
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

pub fn add_to_whitelist(ctx: Context<AddToWhitelist>, max_allocation: u64) -> Result<()> {
    let whitelist = &mut ctx.accounts.whitelist_entry;
    whitelist.user = ctx.accounts.user.key();
    whitelist.launch = ctx.accounts.launch.key();
    whitelist.max_allocation = max_allocation;
    whitelist.bump = ctx.bumps.whitelist_entry;

    emit!(WhitelistAdded {
        user: ctx.accounts.user.key(),
        max_allocation,
    });

    Ok(())
}

pub fn update_launch_status(ctx: Context<UpdateStatus>, new_status: u8) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    require!(ctx.accounts.authority.key() == launch.authority, ErrorCode::Unauthorized);
    launch.status = new_status;

    emit!(StatusUpdated {
        launch: launch.key(),
        status: new_status,
    });

    msg!("Launch status updated to: {}", new_status);
    Ok(())
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
    pub amount_sol: u64,
    pub amount_usdc: u64,
    pub tokens_received: u64,
}

#[event]
pub struct TokensClaimed {
    pub user: Pubkey,
    pub amount: u64,
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
    pub max_allocation: u64,
}

#[event]
pub struct StatusUpdated {
    pub launch: Pubkey,
    pub status: u8,
}

// ============ ERRORS ============

#[derive(Error, Debug, Copy, Clone)]
pub enum ErrorCode {
    #[error("Launch is not live")]
    LaunchNotLive,
    #[error("Launch has not started")]
    NotStarted,
    #[error("Launch has ended")]
    Ended,
    #[error("Below minimum allocation")]
    BelowMinAllocation,
    #[error("Above maximum allocation")]
    AboveMaxAllocation,
    #[error("TGE not yet reached")]
    TGENotReached,
    #[error("Already claimed")]
    AlreadyClaimed,
    #[error("Unauthorized")]
    Unauthorized,
    #[error("Funds already withdrawn")]
    FundsAlreadyWithdrawn,
}