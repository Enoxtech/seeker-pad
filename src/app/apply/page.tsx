'use client'

import { useState } from 'react'
import { applicationsApi } from '@/data/api'

interface FormData {
  projectName: string
  symbol: string
  description: string
  website: string
  twitter: string
  telegram: string
  whitepaperUrl: string
  contactEmail: string
  launchType: 'standard' | 'elite'
  
  // Tokenomics
  totalSupply: string
  launchPrice: string
  raiseTarget: string
  initialLiquidity: string
  teamAllocation: string
  vestingMonths: string
  
  // Team
  teamName: string
  teamRole: string
  teamLinkedIn: string
}

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    symbol: '',
    description: '',
    website: '',
    twitter: '',
    telegram: '',
    whitepaperUrl: '',
    contactEmail: '',
    launchType: 'standard',
    totalSupply: '',
    launchPrice: '',
    raiseTarget: '',
    initialLiquidity: '',
    teamAllocation: '',
    vestingMonths: '',
    teamName: '',
    teamRole: '',
    teamLinkedIn: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const tokenomics = {
        totalSupply: parseInt(formData.totalSupply),
        price: parseFloat(formData.launchPrice),
        hardCap: parseInt(formData.raiseTarget),
        initialLiquidity: parseInt(formData.initialLiquidity),
        teamAllocation: parseInt(formData.teamAllocation),
        vestingMonths: parseInt(formData.vestingMonths),
      }

      const team = {
        name: formData.teamName,
        role: formData.teamRole,
        linkedIn: formData.teamLinkedIn,
      }

      const response: any = await applicationsApi.apply({
        projectName: formData.projectName,
        symbol: formData.symbol,
        description: formData.description,
        website: formData.website,
        twitter: formData.twitter,
        telegram: formData.telegram,
        whitepaperUrl: formData.whitepaperUrl,
        contactEmail: formData.contactEmail,
        launchType: formData.launchType,
        tokenomics,
        team,
      })

      if (response.success) {
        setApplicationId(response.applicationId)
        setSubmitted(true)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.projectName && formData.symbol && formData.description && formData.contactEmail
    }
    if (step === 2) {
      return formData.website || formData.twitter || formData.telegram
    }
    if (step === 3) {
      return formData.totalSupply && formData.launchPrice && formData.raiseTarget
    }
    return true
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Application Submitted!</h1>
          <p className="text-slate-400 mb-4">
            Thank you for applying to launch on SeekerPad.
          </p>
          <div className="p-4 bg-slate-900/50 rounded-xl mb-6">
            <p className="text-slate-400 text-sm">Application ID</p>
            <p className="text-white font-mono text-lg">{applicationId}</p>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            We'll review your application and get back to you within 3-5 business days.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Launch Your Project</h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Apply to launch on SeekerPad - the premier Solana Mobile launchpad
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= s 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${step > s ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Project Information</h2>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-sm mb-2">Project Name *</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="SeekerPad"
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Token Symbol *</label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    placeholder="SEEK"
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Contact Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="team@yourproject.com"
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Launch Type</label>
                  <select
                    name="launchType"
                    value={formData.launchType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="standard">Standard Launch</option>
                    <option value="elite">Elite Launch (NFT holders only)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Links */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Project Links</h2>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourproject.com"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Twitter / X</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourproject"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Telegram</label>
                <input
                  type="url"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="https://t.me/yourproject"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Whitepaper URL</label>
                <input
                  type="url"
                  name="whitepaperUrl"
                  value={formData.whitepaperUrl}
                  onChange={handleChange}
                  placeholder="https://docs.yourproject.com/whitepaper"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 3: Tokenomics */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Tokenomics</h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Total Supply *</label>
                  <input
                    type="number"
                    name="totalSupply"
                    value={formData.totalSupply}
                    onChange={handleChange}
                    placeholder="1000000000"
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Launch Price (SOL) *</label>
                  <input
                    type="number"
                    name="launchPrice"
                    value={formData.launchPrice}
                    onChange={handleChange}
                    placeholder="0.001"
                    step="0.0001"
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Raise Target (SOL) *</label>
                  <input
                    type="number"
                    name="raiseTarget"
                    value={formData.raiseTarget}
                    onChange={handleChange}
                    placeholder="100000"
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Initial Liquidity (%)</label>
                  <input
                    type="number"
                    name="initialLiquidity"
                    value={formData.initialLiquidity}
                    onChange={handleChange}
                    placeholder="80"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Team Allocation (%)</label>
                  <input
                    type="number"
                    name="teamAllocation"
                    value={formData.teamAllocation}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Vesting (months)</label>
                  <input
                    type="number"
                    name="vestingMonths"
                    value={formData.vestingMonths}
                    onChange={handleChange}
                    placeholder="6"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Team */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">Team Information</h2>
              <p className="text-slate-400 text-sm mb-6">
                Help us verify your team. This information is kept confidential.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Team Member Name</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Role</label>
                  <input
                    type="text"
                    name="teamRole"
                    value={formData.teamRole}
                    onChange={handleChange}
                    placeholder="CEO / Developer"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  name="teamLinkedIn"
                  value={formData.teamLinkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/johndoe"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-slate-700/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors text-center"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-center"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
