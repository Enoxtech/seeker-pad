import express, { Request, Response } from 'express';

const router = express.Router();

// AI-Powered Project Analysis
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { launchId, projectData } = req.body;
    
    // In production, this would call an LLM API
    // For now, we'll do rule-based analysis
    
    const analysis = generateAnalysis(projectData);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing project:', error);
    res.status(500).json({ error: 'Failed to analyze project' });
  }
});

// AI Chat endpoint
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    
    const response = generateChatResponse(message, context);
    
    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Generate personalized recommendations
router.get('/recommendations/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    // Get user tier and NFT status from context
    // Return personalized recommendations
    
    const recommendations = {
      recommendedLaunches: [],
      upcomingElite: [],
      riskAssessment: 'moderate',
      matchingPreferences: []
    };
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Helper functions
function generateAnalysis(projectData: any) {
  const scores = {
    team: analyzeTeam(projectData.team),
    tokenomics: analyzeTokenomics(projectData.tokenomics),
    utility: analyzeUtility(projectData.utility),
    community: analyzeCommunity(projectData.community),
    security: analyzeSecurity(projectData.security)
  };
  
  const overallScore = (
    scores.team * 0.25 +
    scores.tokenomics * 0.25 +
    scores.utility * 0.2 +
    scores.community * 0.15 +
    scores.security * 0.15
  );
  
  const riskLevel = overallScore > 75 ? 'low' : overallScore > 50 ? 'medium' : 'high';
  
  return {
    overallScore: Math.round(overallScore),
    riskLevel,
    scores,
    summary: generateSummary(scores),
    redFlags: identifyRedFlags(projectData),
    strengths: identifyStrengths(scores)
  };
}

function analyzeTeam(team: any) {
  if (!team) return 50;
  
  let score = 50;
  
  if (team.verified) score += 20;
  if (team.kyc) score += 15;
  if (team.previousProjects) score += 10;
  if (team.linkedIn) score += 5;
  
  return Math.min(score, 100);
}

function analyzeTokenomics(tokenomics: any) {
  if (!tokenomics) return 50;
  
  let score = 50;
  
  // Check for reasonable supply
  if (tokenomics.totalSupply && tokenomics.totalSupply < 1_000_000_000) {
    score += 10;
  }
  
  // Check liquidity
  if (tokenomics.initialLiquidityPercent >= 60) {
    score += 15;
  } else if (tokenomics.initialLiquidityPercent >= 40) {
    score += 10;
  }
  
  // Check vesting
  if (tokenomics.vestingPeriod >= 6) score += 10;
  if (tokenomics.teamVestingLocked) score += 10;
  
  // Check allocation
  if (tokenomics.communityPercent >= 50) score += 5;
  
  return Math.min(score, 100);
}

function analyzeUtility(utility: any) {
  if (!utility) return 40;
  
  let score = 40;
  
  if (utility.hasUtility) score += 20;
  if (utility.tokenBurn) score += 10;
  if (utility.staking) score += 10;
  if (utility.governance) score += 10;
  if (utility.revenueShare) score += 10;
  
  return Math.min(score, 100);
}

function analyzeCommunity(community: any) {
  if (!community) return 40;
  
  let score = 40;
  
  if (community.discordMembers) score += Math.min(community.discordMembers / 10000, 15);
  if (community.twitterFollowers) score += Math.min(community.twitterFollowers / 10000, 15);
  if (community.telegramMembers) score += Math.min(community.telegramMembers / 5000, 10);
  if (community.verified) score += 10;
  
  return Math.min(score, 100);
}

function analyzeSecurity(security: any) {
  if (!security) return 30;
  
  let score = 30;
  
  if (security.audit) score += 25;
  if (security.kYC) score += 15;
  if (security.liquidityLocked) score += 15;
  if (security.teamTokensVested) score += 10;
  if (security.safetyHooks) score += 5;
  
  return Math.min(score, 100);
}

function generateSummary(scores: any) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (scores.team > 70) strengths.push('Experienced team');
  else if (scores.team < 50) weaknesses.push('Team not verified');
  
  if (scores.tokenomics > 70) strengths.push('Fair tokenomics');
  else if (scores.tokenomics < 50) weaknesses.push('Potentially unfair tokenomics');
  
  if (scores.utility > 60) strengths.push('Clear utility');
  else weaknesses.push('Limited utility');
  
  if (scores.security > 70) strengths.push('Strong security');
  else if (scores.security < 40) weaknesses.push('Security concerns');
  
  return { strengths, weaknesses };
}

function identifyRedFlags(projectData: any) {
  const redFlags: string[] = [];
  
  if (!projectData.team?.verified) {
    redFlags.push('Team identity not verified');
  }
  
  if (projectData.tokenomics?.teamPercent > 30) {
    redFlags.push('High team allocation');
  }
  
  if (projectData.tokenomics?.initialLiquidityPercent < 30) {
    redFlags.push('Low liquidity');
  }
  
  if (!projectData.security?.audit) {
    redFlags.push('No security audit');
  }
  
  if (projectData.community?.fakeFollowers) {
    redFlags.push('Potential fake followers');
  }
  
  return redFlags;
}

function identifyStrengths(scores: any) {
  const strengths: string[] = [];
  
  if (scores.team > 70) strengths.push('Experienced & verified team');
  if (scores.tokenomics > 70) strengths.push('Investor-friendly tokenomics');
  if (scores.utility > 70) strengths.push('Strong token utility');
  if (scores.community > 70) strengths.push('Large active community');
  if (scores.security > 70) strengths.push('Security audits passed');
  
  return strengths;
}

function generateChatResponse(message: string, context?: any) {
  const input = message.toLowerCase();
  
  // Get user context
  const hasNFT = context?.hasNFT;
  const userTier = context?.tier;
  const walletConnected = context?.walletConnected;
  
  // Greetings
  if (input.includes('hello') || input.includes('hi')) {
    return "👋 Hello! I'm SeekerPad AI. I can help you understand launches, tokenomics, and guide you through the platform. What would you like to know?";
  }
  
  // Help
  if (input.includes('help') || input.includes('what can you do')) {
    return `I can help you with:\n\n• **Analyze projects** - Risk assessment & scores\n• **Explain tokenomics** - Breaking down launch terms\n• **Navigate** - How to participate & claim\n• **NFT eligibility** - Check your Elite access\n• **Personalized recommendations** - Based on your profile\n\nWhat interests you?`;
  }
  
  // Tokenomics
  if (input.includes('tokenomics') || input.includes('price') || input.includes('allocation')) {
    return `Tokenomics guide:\n\n**Key Terms:**\n• **Launch Price** - Token price at IDO\n• **Hard Cap** - Max SOL raised\n• **Initial Liquidity** - % going to DEX (aim for 60%+)\n• **Vesting** - How team tokens unlock\n\n**Red Flags:**\n• Team allocation > 20%\n• Liquidity < 40%\n• No audit\n\nWant me to analyze a specific project?`;
  }
  
  // Vesting
  if (input.includes('vesting') || input.includes('claim')) {
    return `Vesting explained:\n\n**TGE** = Token Generation Event (when trading starts)\n\n**Typical Schedule:**\n• 10-30% at TGE\n• Rest over 3-12 months\n\n**Why it matters:**\nLonger vesting = more team commitment\n\nMost SeekerPad launches have 6-month vesting with 20% at TGE.`;
  }
  
  // NFT/Elite
  if (input.includes('nft') || input.includes('elite')) {
    if (hasNFT) {
      return `🎉 You have Elite access!\n\n**Your benefits:**\n• Guaranteed allocations\n• Priority entry window\n• Higher limits\n• Exclusive launches\n\nCheck the Elite page for current opportunities!`;
    }
    return `**Elite Access:**\n\nNFTs unlock:\n• ⭐ Guaranteed allocations\n• Priority participation\n• Exclusive projects\n\n**Get eligible:**\n• Saga Genesis NFT\n• Seeker Pioneer NFT\n• JUP/BONK/Meteora staking\n\nVisit the NFT page to check!`;
  }
  
  // Participating
  if (input.includes('participate') || input.includes('buy') || input.includes('invest')) {
    return `**How to participate:**\n\n1. Connect your wallet\n2. Find a launch you like\n3. Click "Participate"\n4. Enter SOL amount\n5. Confirm transaction\n\n**Tips:**\n• Elite launches need NFTs\n• Have extra SOL for fees\n• Check vesting schedule`;
  }
  
  // Analysis
  if (input.includes('analyze') || input.includes('score') || input.includes('risk')) {
    return `**Project Analysis:**\n\nI evaluate projects on:\n• Team (25%) - Experience & verification\n• Tokenomics (25%) - Fair distribution\n• Utility (20%) - Token use case\n• Community (15%) - Engagement\n• Security (15%) - Audits & safety\n\n**Scoring:**\n• 75-100: ⭐ Strong\n• 50-75: ⚠️ Medium\n• <50: 🔴 High risk\n\nWant me to analyze a specific launch?`;
  }
  
  // ROI
  if (input.includes('roi') || input.includes('profit') || input.includes('moon')) {
    return `I can't predict prices, but here's what to consider:\n\n**Positive signs:**\n• Strong utility\n• Good liquidity\n• Active community\n• Fair tokenomics\n\n**Always:**\n• Do your own research\n• Don't invest more than you can afford\n• Check audit status\n\nSeekerPad vets projects but doesn't guarantee outcomes.`;
  }
  
  // Wallet
  if (input.includes('wallet')) {
    return `**Supported Wallets:**\n\n• Phantom\n• Solflare\n• Backpack\n• Ledger\n\n**For Seeker/Saga:**\nUse Seed Vault for hardware-level security!\n\nClick "Connect Wallet" to get started.`;
  }
  
  // Portfolio
  if (input.includes('portfolio') || input.includes('my tokens')) {
    return `**Your Portfolio:**\n\nVisit /portfolio to see:\n• All participations\n• Claimable tokens\n• Claim history\n• Total value\n\nConnect your wallet to view!`;
  }
  
  // Thank you
  if (input.includes('thank')) {
    return "You're welcome! Feel free to ask if you have more questions. 🚀";
  }
  
  // Default
  return `I understand "${message}".\n\nI can help with:\n• Launch details & analysis\n• How to participate\n• NFT/Elite access\n• Tokenomics explanation\n• Security assessment\n\nWhat would you like to know?`;
}

export default router;
