import React from 'react';
import { TrendingUp } from 'lucide-react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={32} />
          <div>
            <h1 className="text-3xl font-bold">Trading P&L Tracker</h1>
            <p className="text-blue-100 text-sm">Track your daily trading performance</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
