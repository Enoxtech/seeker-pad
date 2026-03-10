'use client';
import React, { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  
  // General Settings State
  const [platformName, setPlatformName] = useState('SeekerPad');
  const [platformFee, setPlatformFee] = useState('2.5%');
  const [defaultNetwork, setDefaultNetwork] = useState('Solana Devnet');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Fee Settings State
  const [tokenListingFee, setTokenListingFee] = useState('$500');
  const [kycFee, setKycFee] = useState('$5');
  const [withdrawalFee, setWithdrawalFee] = useState('$10');
  
  // Security Settings State
  const [require2FA, setRequire2FA] = useState(true);
  const [requireKYC, setRequireKYC] = useState(true);
  const [requireEmailVerify, setRequireEmailVerify] = useState(true);
  
  // Integrations State
  const [integrations, setIntegrations] = useState([
    { name: 'Email (SendGrid)', status: 'Connected', icon: '📧' },
    { name: 'SMS (Twilio)', status: 'Not Connected', icon: '📱' },
    { name: 'Analytics (PostHog)', status: 'Connected', icon: '📊' },
    { name: 'KYC (SumSub)', status: 'Not Connected', icon: '✅' },
    { name: 'Storage (AWS S3)', status: 'Connected', icon: '☁️' },
  ]);

  // API Keys State
  const [apiKeys] = useState([
    { name: 'Production API Key', key: 'sk_live_••••••••••••••••••••••••', status: 'Active', color: 'text-green-400' },
    { name: 'Test API Key', key: 'sk_test_••••••••••••••••••••••••', status: 'Active', color: 'text-yellow-400' },
  ]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPlatformName(settings.platformName || 'SeekerPad');
      setPlatformFee(settings.platformFee || '2.5%');
      setDefaultNetwork(settings.defaultNetwork || 'Solana Devnet');
      setMaintenanceMode(settings.maintenanceMode || false);
      setTokenListingFee(settings.tokenListingFee || '$500');
      setKycFee(settings.kycFee || '$5');
      setWithdrawalFee(settings.withdrawalFee || '$10');
      setRequire2FA(settings.require2FA ?? true);
      setRequireKYC(settings.requireKYC ?? true);
      setRequireEmailVerify(settings.requireEmailVerify ?? true);
      if (settings.integrations) setIntegrations(settings.integrations);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      platformName, platformFee, defaultNetwork, maintenanceMode,
      tokenListingFee, kycFee, withdrawalFee,
      require2FA, requireKYC, requireEmailVerify, integrations
    };
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleIntegration = (index: number) => {
    const newIntegrations = [...integrations];
    newIntegrations[index].status = newIntegrations[index].status === 'Connected' ? 'Not Connected' : 'Connected';
    setIntegrations(newIntegrations);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace('••••••••••••••••', 'abcdef1234567890abcdef'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        {saved && <span className="text-green-400 text-sm">✓ Saved!</span>}
      </div>

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
              <input 
                type="text" 
                value={platformName} 
                onChange={(e) => setPlatformName(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-64" 
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Platform Fee</p>
                <p className="text-slate-400 text-sm">Fee charged per transaction</p>
              </div>
              <input 
                type="text" 
                value={platformFee} 
                onChange={(e) => setPlatformFee(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-64" 
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Default Network</p>
                <p className="text-slate-400 text-sm">Default blockchain network</p>
              </div>
              <select 
                value={defaultNetwork} 
                onChange={(e) => setDefaultNetwork(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-64"
              >
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
                <input 
                  type="checkbox" 
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
          <button onClick={saveSettings} className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
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
              <input 
                type="text" 
                value={platformFee} 
                onChange={(e) => setPlatformFee(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" 
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Token Listing Fee</p>
                <p className="text-slate-400 text-sm">Fee to list a new token</p>
              </div>
              <input 
                type="text" 
                value={tokenListingFee} 
                onChange={(e) => setTokenListingFee(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" 
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">KYC Verification Fee</p>
                <p className="text-slate-400 text-sm">Cost per KYC verification</p>
              </div>
              <input 
                type="text" 
                value={kycFee} 
                onChange={(e) => setKycFee(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" 
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white">Withdrawal Fee</p>
                <p className="text-slate-400 text-sm">Fee for withdrawing funds</p>
              </div>
              <input 
                type="text" 
                value={withdrawalFee} 
                onChange={(e) => setWithdrawalFee(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white w-32" 
              />
            </div>
          </div>
          <button onClick={saveSettings} className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
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
                <input 
                  type="checkbox" 
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">KYC Requirement</p>
                <p className="text-slate-400 text-sm">Require KYC for all users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={requireKYC}
                  onChange={(e) => setRequireKYC(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700">
              <div>
                <p className="text-white">Email Verification</p>
                <p className="text-slate-400 text-sm">Verify email before participation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={requireEmailVerify}
                  onChange={(e) => setRequireEmailVerify(e.target.checked)}
                  className="sr-only peer" 
                />
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
          <button onClick={saveSettings} className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Integrations</h2>
          <div className="space-y-4">
            {integrations.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className={`text-sm ${item.status === 'Connected' ? 'text-green-400' : 'text-slate-400'}`}>{item.status}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleIntegration(i)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    item.status === 'Connected' 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-cyan-500 text-white hover:bg-cyan-600'
                  }`}
                >
                  {item.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
          <button onClick={saveSettings} className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
        </div>
      )}

      {/* API Settings */}
      {activeTab === 'api' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">API Keys</h2>
          <div className="space-y-4">
            {apiKeys.map((item, i) => (
              <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{item.name}</p>
                  <span className={`${item.color} text-sm`}>{item.status}</span>
                </div>
                <p className="text-slate-400 text-sm font-mono mb-2">{item.key}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(item.key)}
                    className="text-cyan-400 text-sm hover:text-cyan-300"
                  >
                    Copy
                  </button>
                  <button className="text-slate-400 text-sm hover:text-white">Regenerate</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">Generate New Key</button>
        </div>
      )}
    </div>
  );
}
