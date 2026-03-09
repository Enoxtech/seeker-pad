'use client'

import { useState, useEffect } from 'react'
import { whalesApi } from '@/data/api'

interface WhaleActivity {
  id: string
  type: 'buy' | 'sell'
  wallet: string
  amount: number
  tokens: number
  priceImpact: number
  timestamp: string
  txn: string
}

interface Whale {
  rank: number
  wallet: string
  totalParticipations: number
  totalValue: number
  averageROI: number
  recentActivity: string
}

interface Alert {
  id: string
  type: string
  wallet: string
  amount: number
  timestamp: string
  launchName: string
}

// Loading Skeleton Component
function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-700/30 rounded-xl ${className}`} />
  )
}

// Whales Page
export default function WhalesPage() {
  const [activeTab, setActiveTab] = useState<'activity' | 'top' | 'alerts'>('activity')
  const [loading, setLoading] = useState(true)
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[]>([])
  const [topWhales, setTopWhales] = useState<Whale[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [whaleSummary, setWhaleSummary] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    // Simulate API delay for demo
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      setWhaleActivity([
        {
          id: '1',
          type: 'buy',
          wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
          amount: 250,
          tokens: 250000,
          priceImpact: 0.5,
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          txn: '5x7K9p2Q4r8...'
        },
        {
          id: '2',
          type: 'buy',
          wallet: '7r1WNiyqp3E4j2dHwJv8qBz3DXYUgZ2G7S8i4qD3M',
          amount: 180,
          tokens: 180000,
          priceImpact: 0.3,
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          txn: '3x2K8p1Q3r7...'
        },
        {
          id: '3',
          type: 'sell',
          wallet: '9ZqD8kV4jN3pQ2wL6mK8fR1tY0bH5vC',
          amount: 50,
          tokens: 50000,
          priceImpact: -0.1,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          txn: '8x1J7p0R2q6...'
        },
        {
          id: '4',
          type: 'buy',
          wallet: '3Ab6P2vX9qW8kL7mN4pR1tY0cH5jB8z',
          amount: 420,
          tokens: 420000,
          priceImpact: 0.8,
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          txn: '9x2K7p0R3q5...'
        },
        {
          id: '5',
          type: 'buy',
          wallet: '5Zm9kL3vX8pW2mN7qR4tY1cH6jB9aF',
          amount: 95,
          tokens: 95000,
          priceImpact: 0.2,
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          txn: '4x8J6p1R2q4...'
        }
      ])

      setTopWhales([
        { rank: 1, wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', totalParticipations: 45, totalValue: 1250, averageROI: 3.2, recentActivity: 'Participated in Bonkify' },
        { rank: 2, wallet: '7r1WNiyqp3E4j2dHwJv8qBz3DXYUgZ2G7S8i4qD3M', totalParticipations: 38, totalValue: 980, averageROI: 2.8, recentActivity: 'Participated in SeekerX' },
        { rank: 3, wallet: '9ZqD8kV4jN3pQ2wL6mK8fR1tY0bH5vC', totalParticipations: 32, totalValue: 850, averageROI: 4.1, recentActivity: 'Claimed SVW tokens' },
        { rank: 4, wallet: '2pL8qK4r9s3Y7mN9vX1cB5hJ8kF4pW', totalParticipations: 28, totalValue: 720, averageROI: 2.5, recentActivity: 'Participated in SeedVault' },
        { rank: 5, wallet: '5mN3pQ7v1w9Z2xL8kR4tY6cH7jB3pN', totalParticipations: 25, totalValue: 650, averageROI: 3.8, recentActivity: 'Participated in Bonkify' }
      ])

      setAlerts([
        { id: '1', type: 'whale_participation', wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', amount: 250, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), launchName: 'Bonkify' },
        { id: '2', type: 'whale_buy', wallet: '7r1WNiyqp3E4j2dHwJv8qBz3DXYUgZ2G7S8i4qD3M', amount: 180, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), launchName: 'SeekerX' },
        { id: '3', type: 'whale_participation', wallet: '3Ab6P2vX9qW8kL7mN4pR1tY0cH5jB8z', amount: 420, timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), launchName: 'SeedVault' }
      ])

      setWhaleSummary({
        totalWhales: 156,
        activeToday: 23,
        totalVolume24h: 45000,
        buySellRatio: 0.75
      })
    } catch (error) {
      console.error('Failed to load whale data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-float">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-bounce">🐋</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Whale Tracker</h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Track large investors and their activity on SeekerPad launches
          </p>
        </div>

        {/* Stats Cards - Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
            <div className="glass rounded-2xl p-5 sm:p-6 card-hover">
              <p className="text-slate-400 text-sm">Total Whales</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{whaleSummary?.totalWhales || 0}</p>
            </div>
            <div className="glass rounded-2xl p-5 sm:p-6 card-hover">
              <p className="text-slate-400 text-sm">Active Today</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1">{whaleSummary?.activeToday || 0}</p>
            </div>
            <div className="glass rounded-2xl p-5 sm:p-6 card-hover">
              <p className="text-slate-400 text-sm">24h Volume</p>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-1">{whaleSummary?.totalVolume24h?.toLocaleString() || 0} SOL</p>
            </div>
            <div className="glass rounded-2xl p-5 sm:p-6 card-hover">
              <p className="text-slate-400 text-sm">Buy/Sell Ratio</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1">{Math.round((whaleSummary?.buySellRatio || 0) * 100)}%</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['activity', 'top', 'alerts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab === 'activity' && '📊 Activity'}
              {tab === 'top' && '🏆 Top Whales'}
              {tab === 'alerts' && '🔔 Alerts'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <>
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="glass rounded-2xl overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left p-4 text-slate-400 font-medium text-sm">Type</th>
                        <th className="text-left p-4 text-slate-400 font-medium text-sm">Wallet</th>
                        <th className="text-right p-4 text-slate-400 font-medium text-sm">Amount</th>
                        <th className="text-right p-4 text-slate-400 font-medium text-sm hidden sm:table-cell">Tokens</th>
                        <th className="text-right p-4 text-slate-400 font-medium text-sm">Impact</th>
                        <th className="text-right p-4 text-slate-400 font-medium text-sm">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whaleActivity.map((activity, index) => (
                        <tr 
                          key={activity.id} 
                          className="border-t border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <td className="p-4">
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              activity.type === 'buy' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {activity.type === 'buy' ? '🟢 Buy' : '🔴 Sell'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-mono text-sm cursor-pointer hover:text-cyan-400 transition-colors">
                              {formatAddress(activity.wallet)}
                            </span>
                          </td>
                          <td className="p-4 text-right text-white font-medium">
                            {activity.amount} SOL
                          </td>
                          <td className="p-4 text-right text-slate-300 hidden sm:table-cell">
                            {activity.tokens.toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <span className={activity.priceImpact >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {activity.priceImpact > 0 ? '+' : ''}{activity.priceImpact}%
                            </span>
                          </td>
                          <td className="p-4 text-right text-slate-400 text-sm">
                            {formatTime(activity.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Whales Tab */}
            {activeTab === 'top' && (
              <div className="grid gap-4 stagger-children">
                {topWhales.map((whale, index) => (
                  <div 
                    key={whale.rank} 
                    className="glass rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        whale.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        whale.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                        whale.rank === 3 ? 'bg-amber-600/20 text-amber-500' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {whale.rank}
                      </div>
                      <div>
                        <p className="text-white font-mono font-medium text-sm sm:text-base">{formatAddress(whale.wallet)}</p>
                        <p className="text-slate-400 text-sm">{whale.recentActivity}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-white">{whale.totalValue} SOL</p>
                      <p className="text-slate-400 text-sm">
                        {whale.totalParticipations} launches • <span className="text-green-400">{whale.averageROI}x</span> avg ROI
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-4 stagger-children">
                {alerts.map((alert, index) => (
                  <div 
                    key={alert.id} 
                    className="glass rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">🐋</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm sm:text-base">
                          Whale in <span className="text-cyan-400">{alert.launchName}</span>
                        </p>
                        <p className="text-slate-400 text-sm font-mono">{formatAddress(alert.wallet)}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-green-400">{alert.amount} SOL</p>
                      <p className="text-slate-400 text-sm">{formatTime(alert.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
