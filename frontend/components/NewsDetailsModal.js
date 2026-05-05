import { useEffect } from 'react';

export default function NewsDetailsModal({ item, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-details-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-[80vw] max-w-[80vw] overflow-y-auto rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#30363d] bg-[#161b22] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-cyan-300">News Details</p>
            <h2 id="news-details-title" className="mt-1 text-lg font-bold text-gray-100">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-400 transition hover:bg-[#0d1117] hover:text-gray-200"
            aria-label="Close details popup"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 text-sm text-gray-300">
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">Summary</p>
            <p className="leading-7 text-gray-200">{item.summary || 'No summary available for this news item.'}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">Published Date</p>
              <p className="mt-1 text-gray-200">{item.publishedAt || 'Unknown'}</p>
            </div>
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">Source</p>
              <p className="mt-1 text-gray-200">{item.source || 'youtube-cron'}</p>
            </div>
          </div>

          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
            <p className="text-xs uppercase tracking-wide text-gray-400">Original Article</p>
            {item.youtubeUrl ? (
              <a
                href={item.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-2 text-cyan-300 underline-offset-2 hover:underline"
              >
                Open source link
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" />
                </svg>
              </a>
            ) : (
              <p className="mt-1 text-gray-400">No source link available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
