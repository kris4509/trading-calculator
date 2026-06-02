import React, { useContext } from 'react';
import { TradingContext } from '../context/TradingContext';

function Statistics() {
  const { getStats, getTodaysSessions, trades } = useContext(TradingContext);
  const stats = getStats();
  const todayCount = getTodaysSessions().length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Trading Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Total Trades</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalTrades}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Today's Sessions</h3>
          <p className="text-3xl font-bold mt-2">{todayCount}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Win Rate</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.winRate}%</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Average Win</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">${stats.avgWin}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Average Loss</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">-${stats.avgLoss}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Profit Factor</h3>
          <p className="text-3xl font-bold mt-2">{stats.profitFactor}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Largest Win</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">${stats.largestWin}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase">Largest Loss</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">${stats.largestLoss}</p>
        </div>
      </div>

      {stats.totalTrades === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No statistics available yet. Start trading and add sessions!</p>
        </div>
      )}
    </div>
  );
}

export default Statistics;
