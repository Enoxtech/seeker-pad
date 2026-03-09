use anchor_lang::prelude::*;

declare_id!("SeekPad1111111111111111111111111111111");

// Launch state
#[account]
#[derive(Default)]
pub struct Launch {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub usdc_vault: Pubkey,
    pub price_per_token: u64,
    pub raise_target: u64,
    pub total_raised: u64,
    pub min_allocation: u64,
    pub max_allocation: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub tge_time: i64,
    pub status: u8,
    pub launch_type: u8,
    pub bump: u8,
}

// User participation
#[account]
#[derive(Default)]
pub struct Participation {
    pub user: Pubkey,
    pub launch: Pubkey,
    pub amount: u64,
    pub tokens_received: u64,
    pub claimed: bool,
    pub claimable_amount: u64,
    pub claimed_amount: u64,
    pub bump: u8,
}

// NFT eligibility
#[account]
#[derive(Default)]
pub struct Eligibility {
    pub user: Pubkey,
    pub category: u8,
    pub is_verified: bool,
    pub bump: u8,
}

// Account contexts
#[derive(Accounts)]
pub struct InitializeLaunch<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 208,
        seeds = [b"launch", mint.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, Launch>,
    pub mint: AccountInfo<'info>,
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
        bump
    )]
    pub usdc_vault: SystemAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Participate<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(
        init,
        payer = user,
        space = 8 + 128,
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
pub struct Claim<'info> {
    #[account(mut)]
    pub participation: Account<'info, Participation>,
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateStatus<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyEligibility<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 66,
        seeds = [b"eligibility", user.key().as_ref()],
        bump
    )]
    pub eligibility: Account<'info, Eligibility>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Initialize a new launch
pub fn initialize_launch(
    ctx: Context<InitializeLaunch>,
    price_per_token: u64,
    raise_target: u64,
    min_allocation: u64,
    max_allocation: u64,
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
    launch.price_per_token = price_per_token;
    launch.raise_target = raise_target;
    launch.total_raised = 0;
    launch.min_allocation = min_allocation;
    launch.max_allocation = max_allocation;
    launch.start_time = start_time;
    launch.end_time = end_time;
    launch.tge_time = tge_time;
    launch.status = 0;
    launch.launch_type = launch_type;
    launch.bump = ctx.bumps.launch;

    msg!("Launch initialized: {}", launch.key());
    Ok(())
}

// Participate in a launch
pub fn participate(ctx: Context<Participate>, amount: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let participation = &mut ctx.accounts.participation;

    require!(launch.status == 1, ErrorCode::LaunchNotLive);
    require!(
        amount >= launch.min_allocation && amount <= launch.max_allocation,
        ErrorCode::InvalidAllocation
    );

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
    participation.amount = amount;
    participation.tokens_received = tokens_received;
    participation.claimed = false;
    participation.claimable_amount = tokens_received;
    participation.claimed_amount = 0;
    participation.bump = ctx.bumps.participation;

    launch.total_raised += amount;

    msg!("User {} participated with {} SOL", ctx.accounts.user.key(), amount);
    Ok(())
}

// Claim tokens
pub fn claim(ctx: Context<Claim>) -> Result<()> {
    let participation = &mut ctx.accounts.participation;
    let launch = &mut ctx.accounts.launch;

    let clock = Clock::get()?;
    require!(clock.unix_timestamp >= launch.tge_time, ErrorCode::TGENotReached);
    require!(!participation.claimed, ErrorCode::AlreadyClaimed);

    let seeds = &[&[b"launch", &[launch.bump]][..]];
    let signer = &[&seeds[..]];

    let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        anchor_lang::spl_token::instruction::Transfer {
            from: launch.vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: launch.vault.to_account_info(),
        },
        signer,
    );
    
    let tokens_to_claim = participation.claimable_amount;
    anchor_lang::spl_token::transfer(cpi_context, tokens_to_claim)?;

    participation.claimed = true;
    participation.claimed_amount = tokens_to_claim;
    participation.claimable_amount = 0;

    msg!("User claimed {} tokens", tokens_to_claim);
    Ok(())
}

// Update launch status
pub fn update_launch_status(ctx: Context<UpdateStatus>, new_status: u8) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    launch.status = new_status;
    msg!("Launch status updated to: {}", new_status);
    Ok(())
}

// Verify eligibility
pub fn verify_eligibility(ctx: Context<VerifyEligibility>, category: u8) -> Result<()> {
    let eligibility = &mut ctx.accounts.eligibility;
    eligibility.user = ctx.accounts.user.key();
    eligibility.category = category;
    eligibility.is_verified = true;
    eligibility.bump = ctx.bumps.eligibility;
    
    msg!("User {} verified for category {}", eligibility.user, category);
    Ok(())
}

#[error]
pub enum ErrorCode {
    #[msg("Launch is not live")]
    LaunchNotLive,
    #[msg("Invalid allocation amount")]
    InvalidAllocation,
    #[msg("TGE not yet reached")]
    TGENotReached,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("NFT required for elite launch")]
    NFTRequired,
}
