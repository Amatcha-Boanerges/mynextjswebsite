import React from 'react';
import Header from './Header'; // Assuming Header is in the same directory

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="p-4 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} fivesixfive. All rights reserved. (Footer Placeholder)</p>
      </footer>
    </div>
  );
} 