'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getLaunchById, getUserParticipation, createParticipation } from '@/data/launches'
import { useWallet } from '@/contexts/WalletContextProvider'
import type { Launch, Participation } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default function LaunchDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { connected, publicKey, connect } = useWallet()
  
  const [launch, setLaunch] = useState<Launch | null>(null)
  const [participation, setParticipation] = useState<Participation | null>(null)
  const [loading, setLoading] = useState(true)
  const [participating, setParticipating] = useState(false)
  const [amount, setAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const launchData = await getLaunchById(id)
        setLaunch(launchData || null)
        
        if (publicKey) {
          const part = await getUserParticipation(publicKey, id)
          setParticipation(part)
        }
      } catch (error) {
        console.error('Failed to load launch:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, publicKey])

  useEffect(() => {
    if (!launch?.startTime || !launch?.endTime) return
    
    const updateTimer = () => {
      const now = new Date()
      const start = new Date(launch.startTime!)
      const end = new Date(launch.endTime!)
      
      let target = start
      let label = 'Starts in'
      
      if (now >= end) {
        setTimeLeft('Ended')
        return
      } else if (now >= start) {
        target = end
        label = 'Ends in'
      } else {
        label = 'Starts in'
      }
      
      const diff = target.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      let timeStr = ''
      if (days > 0) timeStr += `${days}d `
      if (hours > 0 || days > 0) timeStr += `${hours}h `
      timeStr += `${minutes}m ${seconds}s`
      
      setTimeLeft(timeStr)
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [launch?.startTime, launch?.endTime])

  const handleParticipate = async () => {
    if (!connected) {
      await connect()
      return
    }
    
    if (!amount || parseFloat(amount) <= 0) return
    
    setParticipating(true)
    try {
      const part = await createParticipation({
        launchId: id,
        userAddress: publicKey!,
        amountSol: parseFloat(amount),
        txSignature: 'mock_sig_' + Date.now(),
      })
      setParticipation(part)
      setShowModal(false)
      setAmount('')
    } catch (error) {
      console.error('Participation failed:', error)
    } finally {
      setParticipating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!launch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Launch Not Found</h1>
          <Link href="/launchpad" className="text-cyan-400 hover:underline">
            Back to Launchpad
          </Link>
        </div>
      </div>
    )
  }

  const progress = launch.hardCap ? Math.min(((launch.totalRaised || 0) / launch.hardCap) * 100, 100) : 0
  const isLive = launch.status === 'live'
  const isEnded = launch.status === 'ended'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SeekerPad</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/launchpad" className="text-slate-300 hover:text-white transition-colors">
                Launches
              </Link>
              <Link href="/elite" className="text-slate-300 hover:text-white transition-colors">
                Elite
              </Link>
              <Link href="/portfolio" className="text-slate-300 hover:text-white transition-colors">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/launchpad" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Launches
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{launch.symbol?.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{launch.name}</h1>
                    <p className="text-slate-400">${launch.symbol}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {launch.type === 'elite' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium">
                      Elite
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isLive 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : isEnded
                        ? 'bg-slate-500/20 border border-slate-500/30 text-slate-400'
                        : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  }`}>
                    {isLive ? '● Live' : isEnded ? 'Ended' : 'Upcoming'}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed">{launch.description}</p>
              
              {/* Timer */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-xl">
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-1">
                    {isLive ? 'Sale Ends In' : isEnded ? 'Sale Ended' : 'Sale Starts In'}
                  </p>
                  <p className="text-2xl font-mono font-bold text-white">{timeLeft}</p>
                </div>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Tokenomics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-slate-400 text-sm">Launch Price</p>
                  <p className="text-xl font-bold text-white">${launch.launchPrice?.toFixed(4)}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-slate-400 text-sm">Total Supply</p>
                  <p className="text-xl font-bold text-white">{launch.totalSupply?.toLocaleString() || '1B'}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-slate-400 text-sm">Initial Liquidity</p>
                  <p className="text-xl font-bold text-white">{launch.initialLiquidityPercent || 80}%</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-slate-400 text-sm">Hard Cap</p>
                  <p className="text-xl font-bold text-white">${(launch.hardCap || 0).toLocaleString()} SOL</p>
                </div>
              </div>
              
              {/* Vesting Info */}
              <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
                <p className="text-slate-400 text-sm mb-2">Vesting Schedule</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-white">TGE: {launch.initialUnlockPercent || 20}%</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-white">Vesting: {launch.vestingPeriod || 6} months</span>
                </div>
              </div>
            </div>

            {/* Project Links */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Project Links</h2>
              <div className="flex flex-wrap gap-3">
                {launch.websiteUrl && (
                  <a href={launch.websiteUrl} target="_blank" rel="noopener noreferrer" 
                     className="px-4 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
                {launch.twitterUrl && (
                  <a href={launch.twitterUrl} target="_blank" rel="noopener noreferrer"
                     className="px-4 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter
                  </a>
                )}
                {launch.telegramUrl && (
                  <a href={launch.telegramUrl} target="_blank" rel="noopener noreferrer"
                     className="px-4 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28a.83.83 0 01-.402.392l-4.423 2.635a.83.83 0 01-.96-.16l2.47-3.59-2.024-3.046a.83.83 0 01.097-1.15l9.266-3.589a.83.83 0 01.946.243z" />
                    </svg>
                    Telegram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participation Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Participation</h2>
              
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Raised</span>
                  <span className="text-white font-medium">${(launch.totalRaised || 0).toLocaleString()} / ${(launch.hardCap || 0).toLocaleString()} SOL</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-2">{progress.toFixed(1)}% filled</p>
              </div>

              {/* Your Participation */}
              {participation && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-400 font-medium text-sm mb-1">✓ You participated</p>
                  <p className="text-white font-bold">{participation.amount} SOL</p>
                  <p className="text-slate-400 text-sm">{participation.tokenAmount?.toLocaleString()} {launch.symbol}</p>
                  {participation.status === 'pending' && (
                    <p className="text-slate-400 text-sm mt-2">Status: Pending claim</p>
                  )}
                  {participation.status === 'claimed' && (
                    <p className="text-green-400 text-sm mt-2">✓ Tokens claimed</p>
                  )}
                </div>
              )}

              {/* Participate Button */}
              {!isEnded && (
                <button
                  onClick={() => !connected ? connect() : setShowModal(true)}
                  disabled={participating}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!connected 
                    ? 'Connect Wallet' 
                    : participation 
                      ? 'Already Participated' 
                      : 'Participate Now'
                  }
                </button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-400 text-sm">Participants</p>
                  <p className="text-white font-bold">{launch.participants?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Min Allocation</p>
                  <p className="text-white font-bold">{launch.minAllocation || 0.1} SOL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Participation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Participate in {launch.name}</h3>
            
            <div className="mb-4">
              <label className="text-slate-400 text-sm">Amount (SOL)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">You'll receive:</span>
                <span className="text-white font-medium">
                  {amount ? (parseFloat(amount) * (1 / (launch.launchPrice || 0.001))).toLocaleString() : 0} {launch.symbol}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleParticipate}
                disabled={participating || !amount || parseFloat(amount) <= 0}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-white transition-all disabled:opacity-50"
              >
                {participating ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
