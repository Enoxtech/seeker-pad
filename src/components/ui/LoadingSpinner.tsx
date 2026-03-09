'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ size = 'md', text, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  }

  const spinner = (
    <div className="relative">
      <div className={`${sizeClasses[size]} border-purple-500/20 rounded-full`}></div>
      <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-purple-500 rounded-full border-t-transparent animate-spin`}></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {spinner}
        {text && <p className="text-slate-400 mt-4 animate-pulse">{text}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {spinner}
      {text && <p className="text-slate-400 mt-4 animate-pulse">{text}</p>}
    </div>
  )
}

// Skeleton loader component
interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return <div className={`animate-pulse bg-slate-700/50 rounded ${className}`}></div>
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-slate-700/50 rounded ${className}`} style={{ height: '1rem', width: `${Math.random() * 40 + 60}%` }}></div>
      ))}
    </div>
  )
}
