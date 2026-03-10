'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-white text-sm font-medium">{user.name}</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-slate-400 text-xs">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-glossy px-4 py-2 rounded-xl text-sm font-semibold text-white"
      >
        Sign In
      </button>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
