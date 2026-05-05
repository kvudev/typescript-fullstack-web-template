Update the frontend to follow a modern developer news feed dashboard using Next.js (App Router) and TailwindCSS.

Design requirements:

Layout:
- A fixed left sidebar (240px width) with navigation links:
  - For You, Following, Explore, History, Trending
  - Sections: Feeds, Squads, Saved, Discover
- A sticky top header with:
  - Search input (with placeholder and shortcut hint "Ctrl + K")
  - Right-aligned icons (notifications, profile, counters)
- Main content area with:
  - A toolbar row containing pill buttons (Feed settings, Shortcuts, badge counter)
  - A responsive grid of cards (1 column mobile, 2 tablet, 4 desktop)

Card component:
- Rounded container with dark surface background
- Header:
  - Small avatar/icon
  - Bold title (2 lines max, ellipsis)
  - Tag pills (#ai, #linux, etc.)
- Metadata row:
  - Date and reading time
- Preview:
  - Image or video thumbnail with rounded corners
- Footer:
  - Engagement icons (likes, comments, bookmark, share)

Technical:
- Use Next.js App Router
- Use TailwindCSS utility classes only
- Componentize layout (Sidebar, Header, Card, Toolbar)
- Use responsive grid with gap spacing
- Ensure accessibility (semantic HTML)

Bonus:
- Add skeleton loading state
- Add hover animation on cards
- Add tag filtering UI (non-functional)

Output:
- Clean, production-ready React components
- No external UI libraries