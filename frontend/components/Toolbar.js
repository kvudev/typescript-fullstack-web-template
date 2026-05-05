import { useState } from 'react';

export default function Toolbar({ itemCount, activeView = 'for-you', onViewChange }) {
  const [activeFilter, setActiveFilter] = useState(activeView);

  const filters = [
    { id: 'for-you', label: 'Feed Settings' },
    { id: 'following', label: 'Following' },
    { id: 'trending', label: 'Trending' }
  ];

  const handleFilter = (filterId) => {
    setActiveFilter(filterId);
    onViewChange?.(filterId);
  };

  return (
    <div className="ml-60 border-b border-[#30363d] bg-[#0d1117]">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeFilter === filter.id
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-4">
          {/* Shortcuts Button */}
          <button
            type="button"
            aria-label="Open shortcuts"
            className="rounded-full border border-[#30363d] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-300 transition hover:bg-[#161b22]"
          >
            Shortcuts
          </button>

          <button
            type="button"
            aria-label="Open feed settings"
            className="p-2 hover:bg-[#161b22] rounded-md transition text-gray-400 hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 9.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
            </svg>
          </button>

          {/* Item Counter Badge */}
          <span className="px-3 py-1.5 text-sm font-semibold bg-[#161b22] border border-[#30363d] rounded-full text-gray-300">
            {itemCount} items
          </span>
        </div>
      </div>
    </div>
  );
}
