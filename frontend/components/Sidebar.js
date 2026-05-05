export default function Sidebar() {
  const mainNav = ['For You', 'Following', 'Explore', 'History', 'Trending'];
  const sections = ['Feeds', 'Squads', 'Saved', 'Discover'];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-[#30363d] bg-[#0d1117] p-4 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-lg font-bold text-white">DevNews</h1>
      </div>

      {/* Main Navigation */}
      <nav className="mb-6">
        <ul className="space-y-1">
          {mainNav.map((item) => (
            <li key={item}>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[#161b22] hover:text-white transition"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      <div className="border-t border-[#30363d] pt-4">
        <p className="px-3 mb-3 text-xs font-semibold uppercase text-gray-500">Sections</p>
        <ul className="space-y-1">
          {sections.map((item) => (
            <li key={item}>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[#161b22] hover:text-white transition"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
