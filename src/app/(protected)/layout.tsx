import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'My Tasks',
  description: 'Get started with your organization today!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="py-3 px-1 max-w-6xl justify-start m-auto">{children}</main>
    </>
  );
}
