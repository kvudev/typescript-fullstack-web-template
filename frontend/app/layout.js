import '../styles/globals.css';

export const metadata = {
  title: 'DevNews Dashboard',
  description: 'Modern developer news feed dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
