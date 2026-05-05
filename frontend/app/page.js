import DashboardPage from '../components/DashboardPage';

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:3000';

async function getItems() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/content`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const initialItems = await getItems();
  return <DashboardPage initialItems={initialItems} />;
}
