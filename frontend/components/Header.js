import { useState } from 'react';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#30363d] bg-[#0d1117]">
      <div className="ml-60 flex items-center justify-between px-6 py-3">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              className="w-full px-3 py-2 text-sm rounded-md bg-[#161b22] border border-[#30363d] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Ctrl K</span>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#161b22] rounded-md transition">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <button className="p-2 hover:bg-[#161b22] rounded-md transition">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
          </button>

          {/* Counter Badge */}
          <span className="px-2 py-1 text-xs font-semibold bg-[#161b22] border border-[#30363d] rounded-full text-gray-300">
            42
          </span>
        </div>
      </div>
    </header>
  );
}
