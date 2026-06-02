import React, { useContext, useState } from 'react';
import { TradingContext } from '../context/TradingContext';
import { Trash2, Plus } from 'lucide-react';

function DailyTracker() {
  const { getTodaysSessions, addSession, deleteSession } = useContext(TradingContext);
  const [sessionType, setSessionType] = useState('Morning');
  const [pnl, setPnl] = useState('');

  const sessions = getTodaysSessions();
  const todaysTotal = sessions.reduce((sum, s) => sum + s.pnl, 0);

  const handleAddSession = (e) => {
    e.preventDefault();
    if (sessionType && pnl) {
      addSession(new Date().toISOString().split('T')[0], sessionType, pnl);
      setSessionType('Morning');
      setPnl('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Sessions</h2>
        
        {/* Add New Session Form */}
        <form onSubmit={handleAddSession} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white font-semibold"
            >
              <option value="Morning">🌅 Morning Session</option>
              <option value="Afternoon">☀️ Afternoon Session</option>
              <option value="Evening">🌙 Evening Session</option>
            </select>
            <input
              type="number"
              placeholder="P&L Amount"
              step="0.01"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} /> Add Session
            </button>
          </div>
        </form>

        {/* Today's Summary */}
        <div className="bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-bold">Total Sessions Today:</span> {sessions.length} | 
            <span className="font-bold ml-4">Today's Total:</span> 
            <span className={`ml-2 font-bold ${todaysTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${todaysTotal.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{session.sessionName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-lg font-bold ${
                      session.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${session.pnl.toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Delete session"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No sessions recorded today. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyTracker;
