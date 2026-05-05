import { useMemo, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export default function Home({ latestItem, initialItems }) {
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const search = searchText.trim().toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.summary.toLowerCase().includes(search);
      const matchesDate = !dateFilter || item.publishedAt === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [initialItems, searchText, dateFilter]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <section className="mx-auto max-w-6xl px-6 pb-8 pt-12">
          <p className="mb-3 inline-block rounded-full border border-emerald-300/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
            News Summarizer
          </p>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Latest Video Intelligence, Ready to Read
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            Stay current with auto-generated insights from the newest YouTube videos.
            Search fast, filter by date, and browse summaries in one place.
          </p>
        </section>
      </div>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-8 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Latest Generated Post
          </p>
          <h2 className="text-2xl font-extrabold md:text-3xl">{latestItem?.title || 'No latest content yet'}</h2>
          <p className="mt-4 text-slate-300">{latestItem?.summary || 'Content will appear after backend update.'}</p>
          {latestItem?.youtubeUrl ? (
            <a
              className="mt-5 inline-block rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300"
              href={latestItem.youtubeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Watch Original Video
            </a>
          ) : null}
        </article>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Filters & Search
          </p>

          <label className="mb-2 block text-sm text-slate-300" htmlFor="search-input">
            Keyword
          </label>
          <input
            id="search-input"
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search title or summary"
          />

          <label className="mb-2 block text-sm text-slate-300" htmlFor="date-filter">
            Date
          </label>
          <input
            id="date-filter"
            type="date"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Scrollable Content Feed</h3>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
            {filteredItems.length} item(s)
          </span>
        </div>

        <div className="h-[360px] space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.publishedAt}</p>
              <h4 className="mt-1 text-lg font-bold">{item.title}</h4>
              <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
              <a
                href={item.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-cyan-300 underline-offset-2 hover:underline"
              >
                Open YouTube Source
              </a>
            </article>
          ))}

          {!filteredItems.length ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
              No matching content for current filters.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const [latestRes, listRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/content/latest`),
      fetch(`${BACKEND_URL}/api/content`)
    ]);

    const latestData = await latestRes.json();
    const listData = await listRes.json();

    return {
      props: {
        latestItem: latestData.item || null,
        initialItems: listData.items || []
      }
    };
  } catch (error) {
    return {
      props: {
        latestItem: null,
        initialItems: []
      }
    };
  }
}
