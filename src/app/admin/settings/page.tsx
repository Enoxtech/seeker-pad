'use client';
import React, { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['general', 'fees', 'security', 'integrations', 'api'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Platform Name</p>
                <p className="text-slate-400 text-sm">The name of your launchpad</p>
              </div>
              <input type="text" defaultValue="SeekerPad" className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-64" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Platform Fee</p>
                <p className="text-slate-400 text-sm">Fee charged per transaction</p>
              </div>
              <input type="text" defaultValue="2.5%" className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-64" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Default Network</p>
                <p className="text-slate-400 text-sm">Default blockchain network</p>
              </div>
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-64">
                <option>Solana Devnet</option>
                <option>Solana Testnet</option>
                <option>Solana Mainnet</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white">Maintenance Mode</p>
                <p className="text-slate-400 text-sm">Disable platform temporarily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
          <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
        </div>
      )}

      {/* Fee Settings */}
      {activeTab === 'fees' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Fee Structure</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Platform Fee</p>
                <p className="text-slate-400 text-sm">Percentage of each transaction</p>
              </div>
              <input type="text" defaultValue="2.5" className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Token Listing Fee</p>
                <p className="text-slate-400 text-sm">Fee to list a new token</p>
              </div>
              <input type="text" defaultValue="$500" className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">KYC Verification Fee</p>
                <p className="text-slate-400 text-sm">Cost per KYC verification</p>
              </div>
              <input type="text" defaultValue="$5" className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white">Withdrawal Fee</p>
                <p className="text-slate-400 text-sm">Fee for withdrawing funds</p>
              </div>
              <input type="text" defaultValue="$10" className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" />
            </div>
          </div>
          <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Two-Factor Authentication</p>
                <p className="text-slate-400 text-sm">Require 2FA for admin access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">KYC Requirement</p>
                <p className="text-slate-400 text-sm">Require KYC for all users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Email Verification</p>
                <p className="text-slate-400 text-sm">Verify email before participation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white">IP Whitelist</p>
                <p className="text-slate-400 text-sm">Restrict admin access to IPs</p>
              </div>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm">Configure</button>
            </div>
          </div>
          <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Integrations</h2>
          <div className="space-y-4">
            {[
              { name: 'Email (SendGrid)', status: 'Connected', icon: '📧' },
              { name: 'SMS (Twilio)', status: 'Not Connected', icon: '📱' },
              { name: 'Analytics (PostHog)', status: 'Connected', icon: '📊' },
              { name: 'KYC (SumSub)', status: 'Not Connected', icon: '✅' },
              { name: 'Storage (AWS S3)', status: 'Connected', icon: '☁️' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className={`text-sm ${item.status === 'Connected' ? 'text-green-400' : 'text-slate-400'}`}>{item.status}</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm ${
                  item.status === 'Connected' 
                    ? 'bg-slate-700 text-slate-300' 
                    : 'bg-cyan-500 text-white'
                }`}>
                  {item.status === 'Connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Settings */}
      {activeTab === 'api' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">API Keys</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">Production API Key</p>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <p className="text-slate-400 text-sm font-mono mb-2">sk_live_••••••••••••••••••••••••</p>
              <div className="flex gap-2">
                <button className="text-cyan-400 text-sm hover:text-cyan-300">Copy</button>
                <button className="text-slate-400 text-sm hover:text-white">Regenerate</button>
              </div>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">Test API Key</p>
                <span className="text-yellow-400 text-sm">Active</span>
              </div>
              <p className="text-slate-400 text-sm font-mono mb-2">sk_test_••••••••••••••••••••••••</p>
              <div className="flex gap-2">
                <button className="text-cyan-400 text-sm hover:text-cyan-300">Copy</button>
                <button className="text-slate-400 text-sm hover:text-white">Regenerate</button>
              </div>
            </div>
          </div>
          <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Generate New Key</button>
        </div>
      )}
    </div>
  );
}
