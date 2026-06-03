import React, { useContext, useState, useMemo } from 'react';
import { TradingContext } from '../context/TradingContext';
import { BookOpen, Search, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';

const EMOTIONS = [
  { label: 'Calm 😌', value: 'calm' },
  { label: 'Confident 💪', value: 'confident' },
  { label: 'Anxious 😰', value: 'anxious' },
  { label: 'FOMO 😤', value: 'fomo' },
  { label: 'Revenge 😡', value: 'revenge' },
  { label: 'Disciplined 🎯', value: 'disciplined' },
];

const emotionColors = {
  calm: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  confident: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  fomo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  revenge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  disciplined: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

function JournalEntry({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = entry.notes || entry.setup || entry.emotion || entry.instrument;

  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${
      entry.pnl >= 0
        ? 'border-green-200 dark:border-green-800/40'
        : 'border-red-200 dark:border-red-800/40'
    } bg-white dark:bg-slate-800`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-1 self-stretch rounded-full ${entry.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 dark:text-white text-sm">{entry.sessionName}</span>
              {entry.emotion && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${emotionColors[entry.emotion] || ''}`}>
                  {EMOTIONS.find(e => e.value === entry.emotion)?.label || entry.emotion}
                </span>
              )}
              {entry.setup && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {entry.setup}
                </span>
              )}
              {entry.instrument && (
                <span className="text-xs font-mono text-blue-500 font-semibold">{entry.instrument}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className={`text-base font-bold tabular-nums ${entry.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
          </span>
          {hasDetails && (
            <span className="text-gray-400">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
        </div>
      </div>

      {expanded && hasDetails && (
        <div className="px-6 pb-4 pt-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          {entry.notes ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{entry.notes}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">No notes for this session.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Journal() {
  const { trades } = useContext(TradingContext);
  const [search, setSearch] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('');
  const [filterSetup, setFilterSetup] = useState('');
  const [filterResult, setFilterResult] = useState('');

  const setups = useMemo(() => [...new Set(trades.map(t => t.setup).filter(Boolean))], [trades]);

  // Emotion performance breakdown
  const emotionStats = useMemo(() => {
    const map = {};
    trades.forEach(t => {
      if (!t.emotion) return;
      if (!map[t.emotion]) map[t.emotion] = { count: 0, pnl: 0, wins: 0 };
      map[t.emotion].count++;
      map[t.emotion].pnl += t.pnl;
      if (t.pnl > 0) map[t.emotion].wins++;
    });
    return Object.entries(map).map(([emotion, stats]) => ({
      emotion,
      ...stats,
      winRate: ((stats.wins / stats.count) * 100).toFixed(0),
    })).sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  const filtered = useMemo(() => {
    return trades.filter(t => {
      if (filterEmotion && t.emotion !== filterEmotion) return false;
      if (filterSetup && t.setup !== filterSetup) return false;
      if (filterResult === 'win' && t.pnl <= 0) return false;
      if (filterResult === 'loss' && t.pnl >= 0) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          (t.instrument && t.instrument.toLowerCase().includes(q)) ||
          (t.sessionName && t.sessionName.toLowerCase().includes(q)) ||
          t.date.includes(q)
        );
      }
      return true;
    });
  }, [trades, filterEmotion, filterSetup, filterResult, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const journalledCount = trades.filter(t => t.notes || t.emotion || t.setup).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Trade Journal</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {journalledCount} of {trades.length} sessions have journal entries
        </span>
      </div>

      {/* Emotion Performance Insight */}
      {emotionStats.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Performance by Emotion
          </p>
          <div className="flex flex-wrap gap-3">
            {emotionStats.map(({ emotion, count, pnl, winRate }) => (
              <div
                key={emotion}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-slate-600"
              >
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${emotionColors[emotion] || ''}`}>
                  {EMOTIONS.find(e => e.value === emotion)?.label || emotion}
                </span>
                <span className="text-xs text-gray-500">{count} trades</span>
                <span className={`text-xs font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">{winRate}% WR</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes, instruments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
          />
        </div>
        <select
          value={filterEmotion}
          onChange={e => setFilterEmotion(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
        >
          <option value="">All Emotions</option>
          {EMOTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
        {setups.length > 0 && (
          <select
            value={filterSetup}
            onChange={e => setFilterSetup(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Setups</option>
            {setups.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <select
          value={filterResult}
          onChange={e => setFilterResult(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
        >
          <option value="">Wins & Losses</option>
          <option value="win">Wins only</option>
          <option value="loss">Losses only</option>
        </select>
      </div>

      {/* Entries */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No journal entries yet</p>
          <p className="text-sm mt-1">Add notes to your sessions in the Sessions tab</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, entries]) => {
            const dayPnL = entries.reduce((s, e) => s + e.pnl, 0);
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </h3>
                  <span className={`text-sm font-bold flex items-center gap-1 ${dayPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dayPnL >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {dayPnL >= 0 ? '+' : ''}${dayPnL.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  {entries.map(entry => <JournalEntry key={entry.id} entry={entry} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Journal;