import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import Toolbar from '../components/Toolbar';
import Card from '../components/Card';

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:3000';

export default function Home({ initialItems = [] }) {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loadingIds, setLoadingIds] = useState(new Set());

  const filteredItems = useMemo(() => {
    let filtered = initialItems;

    // Search filter
    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        item.title?.toLowerCase().includes(search) ||
        item.summary?.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (activeFilter === 'trending') {
      filtered = filtered.slice(0, Math.ceil(filtered.length / 2));
    } else if (activeFilter === 'recent') {
      filtered = filtered.sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    }

    return filtered;
  }, [initialItems, searchText, activeFilter]);

  return (
    <Layout>
      {/* Toolbar */}
      <Toolbar 
        itemCount={filteredItems.length}
        onFilterChange={setActiveFilter}
      />

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Search Bar in Content */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#161b22] border border-[#30363d] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 transition text-sm"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                item={item}
                isLoading={loadingIds.has(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-sm">No content found</p>
            <p className="text-gray-500 text-xs mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const listRes = await fetch(`${BACKEND_URL}/api/content`);
    const listData = await listRes.json();

    return {
      props: {
        initialItems: listData.items || []
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return {
      props: {
        initialItems: []
      },
      revalidate: 30
    };
  }
}
