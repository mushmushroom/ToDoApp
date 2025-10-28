import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'To Do List',
  description: 'Get started with your organization today!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
