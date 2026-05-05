import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-0">
        {children}
      </main>
    </div>
  );
}
