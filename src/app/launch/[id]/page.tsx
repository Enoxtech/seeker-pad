'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { getUserParticipation, createParticipation } from '@/data/launches'

// Dynamic imports for wallet UI components
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
)
const WalletDisconnectButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletDisconnectButton),
  { ssr: false }
)



export default function LaunchDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const { connection } = useConnection()
  const { connected, publicKey, sendTransaction, connect } = useWallet()
  
  const [launch, setLaunch] = useState<any>(null)
  const [participation, setParticipation] = useState<any>(null)
  const [amountSol, setAmountSol] = useState('')
  const [purchasedAmount, setPurchasedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      // For demo: simulate transaction (mock vault)
      const mockVault = new PublicKey('Gq3q3J7L9m8V6F5qK2p4R8t3Y1n6B7c4D6e9F3g2H1k5')
      const vaultPubkey = mockVault

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey.toBase58()),
          toPubkey: vaultPubkey,
          lamports: Math.floor(amountSolNum * 1e9),
        })
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(publicKey.toBase58())

      try {
        const signature = await sendTransaction(transaction, connection)
        
        // Save to database
        const part = await createParticipation({
          launchId: id,
          userAddress: publicKey.toBase58(),
          amountSol: amountSolNum,
          txSignature: signature,
        })

        setSuccess(`Transaction sent! Signature: ${signature.slice(0, 8)}...`)
        setPurchasedAmount((prev) => (prev || 0) + amountSolNum)
        setAmountSol('')
      } catch (txError: any) {
        // If transaction fails, save as pending anyway for demo
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

  if (!launch) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const progress = launch.raiseTarget 
    ? Math.min((launch.totalRaised / launch.raiseTarget) * 100, 100) 
    : 0

  const tokenPrice = Number(launch.launchPrice)
  const tokenAmount = amountSol ? (Number(amountSol) / tokenPrice).toLocaleString() : '0'

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/launchpad" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SeekerPad
          </a>
          <div className="flex items-center gap-4">
            <WalletMultiButton />
            {connected && <WalletDisconnectButton />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Launch Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {launch.logoUrl ? (
                <img src={launch.logoUrl} alt={launch.name} className="w-20 h-20 rounded-xl" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold">
                  {launch.symbol?.[0] || '?'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{launch.name}</h1>
                <p className="text-gray-400">{launch.symbol}</p>
              </div>
            </div>
            
            <p className="text-gray-300">{launch.description}</p>

            <div className="flex gap-4">
              {launch.websiteUrl && (
                <a href={launch.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                  🌐 Website
                </a>
              )}
              {launch.twitterUrl && (
                <a href={launch.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                  🐦 Twitter
                </a>
              )}
              {launch.telegramUrl && (
                <a href={launch.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                  ✈️ Telegram
                </a>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  launch.status === 'live' ? 'bg-green-500/20 text-green-400' :
                  launch.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {launch.status?.charAt(0).toUpperCase() + launch.status?.slice(1)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span>${tokenPrice} SOL</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Total Raised</span>
                <span className="text-green-400">${Number(launch.totalRaised || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Target</span>
                <span>${Number(launch.raiseTarget || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Participants</span>
                <span>{launch.participantsCount || 0}</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Section */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 max-w-md">
          <h2 className="text-xl font-bold mb-4">Buy Tokens</h2>
          
          {purchasedAmount !== null && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">You have purchased {purchasedAmount} SOL worth of tokens</p>
            </div>
          )}

          {connected ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                  <input
                    type="number"
                    value={amountSol}
                    onChange={(e) => setAmountSol(e.target.value)}
                    placeholder="Enter SOL amount"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>You will receive:</span>
                  <span>{tokenAmount} {launch.symbol}</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                <button
                  onClick={handleBuyTokens}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  {isLoading ? 'Processing...' : 'Buy Tokens'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-400">Connect your wallet to participate</p>
              <button
                onClick={() => connect()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}