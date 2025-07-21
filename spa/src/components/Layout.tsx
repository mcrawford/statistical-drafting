import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-300 shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Statistical Drafting</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a href="/">Home</a></li>
            <li><a href="/pick-order">Pick Order</a></li>
            <li><a href="/build-deck">Build Deck</a></li>
          </ul>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Statistical Drafting © {new Date().getFullYear()} - A tool for Magic: The Gathering drafters</p>
        </div>
      </footer>
    </div>
  );
}