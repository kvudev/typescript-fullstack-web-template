import { useState } from 'react';

export default function Card({ item, isLoading, onOpenDetails }) {
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-[#161b22] border border-[#30363d] p-4 animate-pulse">
        <div className="mb-3 h-4 bg-[#30363d] rounded w-3/4" />
        <div className="mb-3 h-3 bg-[#30363d] rounded w-1/2" />
        <div className="mb-4 h-32 bg-[#30363d] rounded" />
        <div className="flex gap-4">
          <div className="h-5 w-5 bg-[#30363d] rounded" />
          <div className="h-5 w-5 bg-[#30363d] rounded" />
        </div>
      </div>
    );
  }

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] transition-all duration-200 hover:-translate-y-1 hover:border-gray-500 hover:shadow-lg"
      onClick={onOpenDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${item.title || 'news item'}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#30363d]">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-200 line-clamp-2 group-hover:text-white transition">
              {item.title || 'Untitled'}
            </h3>
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
            #dev
          </span>
          <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
            #news
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex gap-2 border-b border-[#30363d] px-4 py-2 text-xs text-gray-500">
        <span>{item.publishedAt || 'Unknown'}</span>
        <span>•</span>
        <span>5 min read</span>
      </div>

      {/* Preview Image/Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-[#0d1117]">
        {!imageError ? (
          <img
            src={`https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#161b22]">
            <svg className="h-10 w-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12 .5a.5.5 0 00-1 0v5a.5.5 0 001 0v-5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Footer - Engagement Icons */}
      <div className="mt-auto flex items-center justify-between border-t border-[#30363d] px-4 py-3 text-gray-400">
        <div className="flex gap-4">
          {/* Like */}
          <button
            className="flex items-center gap-1 hover:text-emerald-400 transition group/icon"
            onClick={(e) => e.stopPropagation()}
            type="button"
          >
            <svg className="w-5 h-5 group-hover/icon:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H9a2 2 0 01-2-2v-7a6 6 0 016-6z" />
            </svg>
            <span className="text-xs">24</span>
          </button>

          {/* Comment */}
          <button
            className="flex items-center gap-1 hover:text-cyan-400 transition group/icon"
            onClick={(e) => e.stopPropagation()}
            type="button"
          >
            <svg className="w-5 h-5 group-hover/icon:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">8</span>
          </button>
        </div>

        {/* Bookmark & Share */}
        <div className="flex gap-4">
          <button
            className="hover:text-emerald-400 transition"
            onClick={(e) => e.stopPropagation()}
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            className="hover:text-cyan-400 transition"
            onClick={(e) => e.stopPropagation()}
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C9.589 12.938 10 12.502 10 11.5c0-1.38-.895-2.5-2-2.5S6 10.12 6 11.5c0 1.002.411 1.938 1.316 2.342M14.684 13.342C15.589 12.938 16 12.502 16 11.5c0-1.38-.895-2.5-2-2.5s-2 1.12-2 2.5c0 1.002.411 1.938 1.316 2.342M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
