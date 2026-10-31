import './globals.css'; 
import React from 'react';

export const metadata = {
  title: 'Hope, Inc. ERP',
  description: 'Enterprise Resource Planning System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}