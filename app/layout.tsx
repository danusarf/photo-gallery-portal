import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: 'Share and manage your photo galleries',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
