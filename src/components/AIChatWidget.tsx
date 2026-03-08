'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatWidgetProps {
  context?: {
    currentLaunch?: {
      id: string
      name: string
      symbol: string
      type: 'elite' | 'standard'
      status: 'upcoming' | 'live' | 'ended'
    }
    userTier?: string
    hasNFT?: boolean
  }
}

export default function AIChatWidget({ context }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m SeekerPad AI. I can help you:\n\n• Understand tokenomics\n• Find the best launches\n• Explain vesting & allocation\n• Navigate the platform\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await generateResponse(userMessage.content, context)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">SeekerPad AI</h3>
                <p className="text-xs text-green-400">● Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// AI Response Generation - Rule-based for now, can be upgraded to LLM
function generateResponse(userInput: string, context?: AIChatWidgetProps['context']): string {
  const input = userInput.toLowerCase()
  
  // Get current launch context
  const currentLaunch = context?.currentLaunch
  const hasNFT = context?.hasNFT
  const userTier = context?.userTier

  // Greetings
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return "👋 Hello! I'm here to help you navigate SeekerPad. Ask me about launches, tokenomics, or how to participate!"
  }

  // Help
  if (input.includes('help') || input.includes('what can you do')) {
    return `I can help you with:\n\n• **Finding launches** - Best upcoming projects\n• **Understanding tokenomics** - Breaking down prices & allocation\n• **Vesting explained** - How & when to claim tokens\n• **NFT eligibility** - Check your Elite access\n• **Platform navigation** - How to use SeekerPad\n\nWhat would you like to know?`
  }

  // Current launch questions
  if (currentLaunch && (input.includes('this launch') || input.includes('current') || input.includes('bonkify'))) {
    if (currentLaunch.status === 'live') {
      return `**${currentLaunch.name}** is currently live!\n\n• Type: ${currentLaunch.type === 'elite' ? '⭐ Elite (NFT holders only)' : 'Standard'}\n• Status: Live now\n• ${currentLaunch.type === 'elite' ? 'You need an Elite NFT to participate.' : 'Anyone can participate!'}\n\nWould you like me to explain the tokenomics or help you participate?`
    } else if (currentLaunch.status === 'upcoming') {
      return `**${currentLaunch.name}** is upcoming.\n\n• Type: ${currentLaunch.type === 'elite' ? '⭐ Elite' : 'Standard'}\n• Status: Coming soon\n\nWant me to remind you when it goes live?`
    }
  }

  // Tokenomics questions
  if (input.includes('tokenomics') || input.includes('price') || input.includes('allocation')) {
    return `Here's how tokenomics work on SeekerPad:\n\n**Launch Price** - The price per token at IDO\n**Hard Cap** - Maximum amount raised\n**Initial Liquidity** - % of tokens added to DEX\n\n**Example:** If launch price is $0.001 and you spend 1 SOL (~$100), you'd get ~100,000 tokens.\n\nWant me to check the current launch details?`
  }

  // Vesting questions
  if (input.includes('vesting') || input.includes('claim') || input.includes('tge')) {
    return `**Vesting Explained:**\n\n• **TGE** (Token Generation Event) - When tokens first become available\n• **Initial Unlock** - % available at TGE (usually 10-30%)\n• **Vesting Period** - Time until all tokens are unlocked (typically 3-12 months)\n\n**Example:** 20% at TGE, then 10% monthly for 8 months.\n\nMost launches on SeekerPad have 6-month vesting. Want more details?`
  }

  // NFT/Elite questions
  if (input.includes('nft') || input.includes('elite') || input.includes('access')) {
    if (hasNFT) {
      return `🎉 You have Elite access!\n\n**Your benefits:**\n• Guaranteed allocation on Elite launches\n• Priority participation window\n• Higher allocation limits\n• Exclusive projects\n\nCheck out the Elite page for current opportunities!`
    } else {
      return `**Elite Access via NFT:**\n\nNFT holders get:\n• ⭐ Guaranteed allocations\n• Priority entry (first 30-60 mins)\n• Exclusive launches\n\n**Categories:**\n• Saga Genesis - Saga phone owners\n• Seeker Pioneer - Seeker owners\n• Jupiter Aligned - JUP stakers\n• Bonk Community - BONK stakers\n• Meteora LP - Meteora stakers\n\nVisit the NFT page to check eligibility!`
    }
  }

  // Participation questions
  if (input.includes('participate') || input.includes('how to buy') || input.includes('invest')) {
    return `**How to Participate:**\n\n1. **Connect Wallet** - Click the wallet button\n2. **Browse Launches** - Find a project you like\n3. **Click Participate** - Enter your SOL amount\n4. **Confirm** - Sign the transaction\n5. **Wait for TGE** - Then claim your tokens!\n\n**Requirements:**\n• SOL in your wallet\n• For Elite launches: Need an eligible NFT\n\nWant me to guide you through?`
  }

  // Wallet questions
  if (input.includes('wallet') || input.includes('connect')) {
    return `**Supported Wallets:**\n\n• Phantom\n• Solflare\n• Backpack\n• Ledger (via adapter)\n\n**For Seeker/Saga users:**\nUse the Seed Vault for maximum security!\n\nJust click "Connect Wallet" and select your preferred wallet. Need help?`
  }

  // ROI/Price questions
  if (input.includes('roi') || input.includes('profit') || input.includes('moon') || input.includes('price')) {
    return `I can't predict prices, but here's what to consider:\n\n**Factors that affect potential ROI:**\n• Project utility & token demand\n• Liquidity depth\n• Community engagement\n• Market conditions\n\n**SeekerPad's role:**\nWe vet projects but don't guarantee outcomes. Always do your own research!\n\nWant me to explain how to evaluate a project?`
  }

  // Project evaluation
  if (input.includes('evaluate') || input.includes('research') || input.includes('check')) {
    return `**Evaluating a Launch:**\n\n1. **Team** - Check if verified/known\n2. **Tokenomics** - Supply, allocation, vesting\n3. **Utility** - What is the token for?\n4. **Community** - Discord/Twitter activity\n5. **Audit** - Security audits done?\n\nSeekerPad shows KYC badges & audit status on each launch. Check the launch page for details!`
  }

  // Portfolio questions
  if (input.includes('portfolio') || input.includes('my tokens') || input.includes('my participation')) {
    return `**Your Portfolio:**\n\nVisit the Portfolio page to see:\n• All your participations\n• Claimable tokens\n• Claim history\n• Total value\n\nConnect your wallet to view your dashboard!`
  }

  // Thank you
  if (input.includes('thank') || input.includes('thanks')) {
    return "You're welcome! 🎉\n\nFeel free to ask if you have more questions. Happy investing!"
  }

  // Default response
  return `I understand you're asking about "${userInput}".\n\nHere are some things I can help with:\n• Launch details & tokenomics\n• How to participate\n• NFT/Elite access\n• Vesting & claiming\n• Wallet setup\n\nWhat would you like to know more about?`
}
