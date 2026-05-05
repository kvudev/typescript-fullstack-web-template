'use client';

import { useMemo, useState } from 'react';
import Layout from './Layout';
import Toolbar from './Toolbar';
import Card from './Card';
import NewsDetailsModal from './NewsDetailsModal';

const tagOptions = ['all', 'ai', 'linux', 'web', 'cloud'];

export default function DashboardPage({ initialItems = [] }) {
  const [searchText, setSearchText] = useState('');
  const [activeView, setActiveView] = useState('for-you');
  const [activeTag, setActiveTag] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    let nextItems = [...initialItems];

    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      nextItems = nextItems.filter((item) =>
        (item.title || '').toLowerCase().includes(keyword) ||
        (item.summary || '').toLowerCase().includes(keyword)
      );
    }

    if (activeView === 'trending') {
      nextItems = nextItems.slice(0, Math.max(1, Math.ceil(nextItems.length / 2)));
    }

    if (activeView === 'following') {
      nextItems = nextItems.filter((_, idx) => idx % 2 === 0);
    }

    if (activeTag !== 'all') {
      nextItems = nextItems.filter((item) => {
        const haystack = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
        return haystack.includes(activeTag);
      });
    }

    return nextItems;
  }, [initialItems, searchText, activeView, activeTag]);

  return (
    <Layout>
      <Toolbar itemCount={filteredItems.length} activeView={activeView} onViewChange={setActiveView} />

      <section className="px-6 py-6" aria-label="Feed content">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label htmlFor="feed-search" className="sr-only">
            Search feed
          </label>
          <div className="relative w-full max-w-md">
            <input
              id="feed-search"
              type="search"
              placeholder="Search title or summary"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 pr-10 text-sm text-gray-100 outline-none transition focus:border-cyan-400"
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Tag filters">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                activeTag === tag
                  ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300'
                  : 'border-[#30363d] text-gray-400 hover:border-gray-400 hover:text-gray-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                item={item}
                isLoading={false}
                onOpenDetails={() => setSelectedItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#30363d] bg-[#161b22]/60 p-10 text-center text-sm text-gray-400">
            No matching posts for the current filters.
          </div>
        )}
      </section>

      <NewsDetailsModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </Layout>
  );
}
