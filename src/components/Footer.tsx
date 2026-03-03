'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/seekerpad' },
    { name: 'Discord', icon: '💬', href: 'https://discord.gg/seekerpad' },
    { name: 'Telegram', icon: '✈️', href: 'https://t.me/seekerpad' },
    { name: 'GitHub', icon: '🐙', href: 'https://github.com/seekerpad' },
  ];

  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <span className="text-xl font-bold text-white">SeekerPad</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              The premier launchpad for Solana Mobile (Seeker & Saga) users. 
              Discover and invest in exclusive early-stage tokens.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg hover:bg-purple-600/20 hover:text-purple-400 transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Launches', href: '/' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'NFT Hub', href: '/nft' },
                { label: 'Elite Launchpad', href: '/elite' },
                { label: 'Profile', href: '/profile' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Documentation', href: '#' },
                { label: 'API', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Contact Us', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} SeekerPad. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">Built for Solana Mobile</span>
            <span className="text-purple-500">•</span>
            <span className="text-gray-500 text-sm">Made with 🔥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
