import React, { useContext, useState } from 'react';
import { TradingContext } from '../context/TradingContext';
import { Save } from 'lucide-react';

function Settings() {
  const { monthlyTarget, setMonthlyTarget, trades } = useContext(TradingContext);
  const [newTarget, setNewTarget] = useState(monthlyTarget);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setMonthlyTarget(parseFloat(newTarget));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all trading data? This cannot be undone.')) {
      localStorage.removeItem('tradingData');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Monthly Target */}
      <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg border border-gray-200 dark:border-slate-600">
        <h3 className="text-lg font-semibold mb-4">Monthly Profit Target</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Set Your Monthly Target
            </label>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              step="100"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
              placeholder="Enter target amount"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={20} /> Save
          </button>
        </div>
        {saved && <p className="text-green-600 mt-2 text-sm">Target saved successfully!</p>}
      </div>

      {/* Data Management */}
      <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg border border-gray-200 dark:border-slate-600">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Export your trading data as JSON for backup or analysis.
            </p>
            <button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
            >
              Export Data
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Total trades recorded: <span className="font-bold">{trades.length}</span>
            </p>
            <button
              onClick={handleClearData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">About This App</h4>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Trading P&L Tracker helps you record and analyze your daily trading performance. All data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}

export default Settings;
