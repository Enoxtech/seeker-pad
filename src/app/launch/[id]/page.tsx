'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { getUserParticipation, createParticipation, claimTokens } from '@/data/launches'

export default function LaunchDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const { connection } = useConnection()
  const { connected, publicKey, sendTransaction, connect } = useWallet()
  
  const [launch, setLaunch] = useState<any>(null)
  const [participation, setParticipation] = useState<any>(null)
  const [amountSol, setAmountSol] = useState('')
  const [purchasedAmount, setPurchasedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasClaimed, setHasClaimed] = useState(false)

  // Fetch launch data
  useEffect(() => {
    async function fetchLaunch() {
      try {
        const res = await fetch(`/api/launches/${id}`)
        const data = await res.json()
        setLaunch(data)
      } catch (err) {
        console.error('Failed to fetch launch:', err)
      }
    }
    fetchLaunch()
  }, [id])

  // Fetch user participation
  useEffect(() => {
    async function fetchParticipation() {
      if (publicKey) {
        try {
          const part = await getUserParticipation(publicKey.toBase58(), id)
          setParticipation(part)
          if (part) {
            setPurchasedAmount(Number(part.amount))
            setHasClaimed(part.status === 'claimed')
          }
        } catch (err) {
          console.error('Failed to fetch participation:', err)
        }
      }
    }
    fetchParticipation()
  }, [publicKey, id])

  const handleBuyTokens = async () => {
    setError('')
    setSuccess('')
    
    if (!amountSol || isNaN(Number(amountSol))) {
      setError('Please enter a valid amount')
      return
    }
    
    const amountSolNum = Number(amountSol)
    
    if (launch?.minAllocation && amountSolNum < Number(launch.minAllocation)) {
      setError(`Minimum allocation is ${launch.minAllocation} SOL`)
      return
    }
    
    if (launch?.maxAllocation && amountSolNum > Number(launch.maxAllocation)) {
      setError(`Maximum allocation is ${launch.maxAllocation} SOL`)
      return
    }

    if (!publicKey || !sendTransaction || !connection) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)

    try {
      const mockVault = new PublicKey('Gq3q3J7L9m8V6F5qK2p4R8t3Y1n6B7c4D6e9F3g2H1k5')

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey.toBase58()),
          toPubkey: mockVault,
          lamports: Math.floor(amountSolNum * 1e9),
        })
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(publicKey.toBase58())

      try {
        const signature = await sendTransaction(transaction, connection)
        
        const part = await createParticipation({
          launchId: id,
          userAddress: publicKey.toBase58(),
          amountSol: amountSolNum,
          txSignature: signature,
        })

        setSuccess(`🎉 Transaction sent! Signature: ${signature.slice(0, 8)}...`)
        setPurchasedAmount((prev) => (prev || 0) + amountSolNum)
        setAmountSol('')
      } catch (txError: any) {
        const part = await createParticipation({
          launchId: id,
          userAddress: publicKey.toBase58(),
          amountSol: amountSolNum,
          txSignature: 'demo-' + Date.now(),
        })
        
        setSuccess(`Demo mode: Saved ${amountSolNum} SOL participation!`)
        setPurchasedAmount((prev) => (prev || 0) + amountSolNum)
        setAmountSol('')
      }
    } catch (err: any) {
      console.error('Transaction error:', err)
      setError(err.message || 'Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!participation) return
    
    setIsClaiming(true)
    setError('')
    setSuccess('')
    
    try {
      await claimTokens(participation.id, `claim_${Date.now()}`)
      setSuccess('🎉 Tokens claimed successfully!')
      setHasClaimed(true)
    } catch (err: any) {
      console.error('Claim error:', err)
      setError(err.message || 'Claim failed')
    } finally {
      setIsClaiming(false)
    }
  }

  if (!launch) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse opacity-30"></div>
          <div className="relative w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const progress = launch.raiseTarget 
    ? Math.min((launch.totalRaised / launch.raiseTarget) * 100, 100) 
    : 0

  const tokenPrice = Number(launch.launchPrice)
  const tokenAmount = amountSol ? (Number(amountSol) / tokenPrice).toLocaleString() : '0'
  const purchasedTokenAmount = purchasedAmount ? (purchasedAmount / tokenPrice).toLocaleString() : '0'

  // Determine gradient based on launch type
  const getGradient = () => {
    if (launch.type === 'elite') return 'from-purple-600 via-pink-600 to-purple-600'
    if (launch.status === 'live') return 'from-green-500 via-emerald-500 to-green-500'
    if (launch.status === 'upcoming') return 'from-blue-500 via-cyan-500 to-blue-500'
    return 'from-gray-500 via-slate-500 to-gray-500'
  }

  const isLaunchEnded = launch.status === 'ended'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className={`absolute inset-0 bg-gradient-to-r ${getGradient()} opacity-20`}></div>
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Token Icon */}
                <div className="relative">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${getGradient()} flex items-center justify-center text-4xl md:text-5xl font-bold shadow-2xl`}>
                    {launch.symbol?.[0] || '?'}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    launch.status === 'live' ? 'bg-green-500' :
                    launch.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {launch.status?.toUpperCase()}
                  </div>
                </div>

                {/* Token Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold">{launch.name}</h1>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">{launch.symbol}</span>
                    {launch.type === 'elite' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                        ⭐ ELITE
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-lg max-w-2xl mb-6">{launch.description}</p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3">
                    {launch.websiteUrl && (
                      <a href={launch.websiteUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105">
                        🌐 <span className="text-sm">Website</span>
                      </a>
                    )}
                    {launch.twitterUrl && (
                      <a href={launch.twitterUrl} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105">
                        🐦 <span className="text-sm">Twitter</span>
                      </a>
                    )}
                    {launch.telegramUrl && (
                      <a href={launch.telegramUrl} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105">
                        ✈️ <span className="text-sm">Telegram</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 p-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"></div>
            <p className="text-gray-400 text-sm mb-1">Price</p>
            <p className="text-2xl font-bold text-white">${tokenPrice}</p>
            <p className="text-purple-400 text-sm">per token</p>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 p-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-full blur-2xl"></div>
            <p className="text-gray-400 text-sm mb-1">Raised</p>
            <p className="text-2xl font-bold text-white">${Number(launch.totalRaised || 0).toLocaleString()}</p>
            <p className="text-green-400 text-sm">of ${Number(launch.raiseTarget || 0).toLocaleString()}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 p-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
            <p className="text-gray-400 text-sm mb-1">Participants</p>
            <p className="text-2xl font-bold text-white">{launch.participantsCount || 0}</p>
            <p className="text-blue-400 text-sm">investors</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 p-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl"></div>
            <p className="text-gray-400 text-sm mb-1">Progress</p>
            <p className="text-2xl font-bold text-white">{progress.toFixed(0)}%</p>
            <p className="text-pink-400 text-sm">completed</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-r ${getGradient()} opacity-10`}></div>
              
              <div className="relative p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                  {isLaunchEnded ? 'Token Claim' : 'Participate in Sale'}
                </h2>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">Fundraising Progress</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>${Number(launch.totalRaised || 0).toLocaleString()} raised</span>
                    <span>${Number(launch.raiseTarget || 0).toLocaleString()} target</span>
                  </div>
                </div>

                {/* Allocation Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Min Allocation</p>
                    <p className="text-xl font-bold">{launch.minAllocation || 0.1} SOL</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Max Allocation</p>
                    <p className="text-xl font-bold">{launch.maxAllocation || 10} SOL</p>
                  </div>
                </div>

                {/* User Participation Status */}
                {purchasedAmount !== null && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="text-green-400 font-semibold">You have participated!</p>
                        <p className="text-gray-400 text-sm">Your contribution: {purchasedAmount} SOL → {purchasedTokenAmount} {launch.symbol}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connected Wallet - Show Purchase Form or Claim */}
                {connected ? (
                  <div className="space-y-4">
                    {isLaunchEnded ? (
                      // Claim Section for Ended Launches
                      <div className="space-y-4">
                        {hasClaimed ? (
                          <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl text-center">
                            <span className="text-4xl mb-3 block">✅</span>
                            <p className="text-green-400 font-bold text-lg">Tokens Already Claimed!</p>
                            <p className="text-gray-400 text-sm mt-1">{purchasedTokenAmount} {launch.symbol} received</p>
                          </div>
                        ) : purchasedAmount !== null ? (
                          <>
                            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🎁</span>
                                <div>
                                  <p className="text-purple-400 font-semibold">Tokens Ready to Claim!</p>
                                  <p className="text-gray-400 text-sm">Claim your {purchasedTokenAmount} {launch.symbol}</p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={handleClaim}
                              disabled={isClaiming}
                              className="w-full py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/25"
                            >
                              {isClaiming ? (
                                <span className="flex items-center justify-center gap-2">
                                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                  Claiming...
                                </span>
                              ) : (
                                '🎁 Claim Tokens'
                              )}
                            </button>
                          </>
                        ) : (
                          <div className="p-6 bg-white/5 rounded-xl text-center">
                            <p className="text-gray-400">You didn't participate in this launch</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Purchase Form for Live/Upcoming Launches
                      <>
                        <div className="relative">
                          <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={amountSol}
                              onChange={(e) => setAmountSol(e.target.value)}
                              placeholder="0.00"
                              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-lg"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">SOL</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-gray-400">You will receive:</span>
                          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {tokenAmount} {launch.symbol}
                          </span>
                        </div>

                        {error && (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm">⚠️ {error}</p>
                          </div>
                        )}

                        {success && (
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <p className="text-green-400 text-sm">{success}</p>
                          </div>
                        )}

                        <button
                          onClick={handleBuyTokens}
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Processing...
                            </span>
                          ) : (
                            '🔥 Buy Tokens'
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="text-4xl">🔌</span>
                    </div>
                    <p className="text-gray-400 mb-6">{isLaunchEnded ? 'Connect your wallet to claim tokens' : 'Connect your wallet to participate in the token sale'}</p>
                    <button
                      onClick={() => connect()}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Token Info Card */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📊</span> Tokenomics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Token Name</span>
                  <span className="font-medium">{launch.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Symbol</span>
                  <span className="font-medium">{launch.symbol}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="font-medium">1,000,000,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Initial Supply</span>
                  <span className="font-medium">100,000,000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Decimals</span>
                  <span className="font-medium">9</span>
                </div>
              </div>
            </div>

            {/* Sale Stages */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📅</span> Sale Schedule
              </h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border ${launch.status === 'upcoming' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phase 1</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${launch.status === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                      {launch.status === 'upcoming' ? 'Upcoming' : 'Live'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Price: ${tokenPrice} SOL</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phase 2</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/50 text-white">Upcoming</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Price: ${(tokenPrice * 1.25).toFixed(3)} SOL</p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-3xl bg-amber-500/5 border border-amber-500/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-amber-400 mb-1">Risk Warning</h4>
                  <p className="text-gray-400 text-sm">Cryptocurrency investments carry high risk. Do your own research before participating.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}