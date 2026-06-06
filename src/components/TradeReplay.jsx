import { useContext, useMemo } from 'react';
import { TradingContext } from '../context/TradingContext';
import { X, TrendingUp, TrendingDown, Clock, BookOpen, Activity } from 'lucide-react';

const EMOTION_LABELS = {
  calm: 'Calm 😌', confident: 'Confident 💪', anxious: 'Anxious 😰',
  fomo: 'FOMO 😤', revenge: 'Revenge 😡', disciplined: 'Disciplined 🎯',
};

const emotionColors = {
  calm: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  confident: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  fomo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  revenge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  disciplined: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

function SessionCard({ session }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-1 h-10 rounded-full ${session.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">{session.sessionName}</span>
              {session.emotion && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${emotionColors[session.emotion] || ''}`}>
                  {EMOTION_LABELS[session.emotion] || session.emotion}
                </span>
              )}
              {session.setup && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{
                  background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
                }}>{session.setup}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock size={10} style={{ color: 'rgba(148,163,184,0.4)' }} />
              <span className="text-[11px]" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {session.instrument && (
                <span className="text-[11px] font-mono font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  {session.instrument}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`text-base font-black ${session.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {session.pnl >= 0 ? '+' : ''}${session.pnl.toFixed(2)}
        </span>
      </div>
      {session.notes && (
        <div className="px-4 pb-3 pt-0">
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.6)' }}>{session.notes}</p>
        </div>
      )}
    </div>
  );
}

function TradeReplay({ date, onClose }) {
  const { trades } = useContext(TradingContext);

  const dayTrades = useMemo(() => {
    if (!date) return [];
    return trades
      .filter(t => t.date === date)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [trades, date]);

  const summary = useMemo(() => {
    if (dayTrades.length === 0) return null;
    const total = dayTrades.reduce((s, t) => s + t.pnl, 0);
    const wins = dayTrades.filter(t => t.pnl > 0);
    const losses = dayTrades.filter(t => t.pnl < 0);
    const emotions = [...new Set(dayTrades.map(t => t.emotion).filter(Boolean))];
    const setups = [...new Set(dayTrades.map(t => t.setup).filter(Boolean))];
    const instruments = [...new Set(dayTrades.map(t => t.instrument).filter(Boolean))];
    const best = wins.length > 0 ? Math.max(...wins.map(t => t.pnl)) : 0;
    const worst = losses.length > 0 ? Math.min(...losses.map(t => t.pnl)) : 0;
    return { total, wins: wins.length, losses: losses.length, emotions, setups, instruments, best, worst };
  }, [dayTrades]);

  const formatted = date ? new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) : '';

  if (!date || dayTrades.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(15,28,50,0.98) 100%)',
        border: '1px solid rgba(59,130,246,0.15)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 pb-3" style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(15,28,50,0.98) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <h2 className="text-lg font-black text-white">Trade Replay</h2>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>{formatted}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
            <X size={18} style={{ color: 'rgba(148,163,184,0.6)' }} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Day Summary */}
          <div className="rounded-xl p-4" style={{
            background: summary.total >= 0 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
            border: `1px solid ${summary.total >= 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
          }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.5)' }}>Day Summary</span>
              <span className={`text-xl font-black flex items-center gap-1 ${summary.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {summary.total >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                {summary.total >= 0 ? '+' : ''}${summary.total.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-lg font-black text-white">{dayTrades.length}</p>
                <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>Trades</p>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-lg font-black"><span className="text-green-400">{summary.wins}</span><span style={{ color: 'rgba(148,163,184,0.3)' }}> / </span><span className="text-red-400">{summary.losses}</span></p>
                <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>W / L</p>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-black" style={{ color: summary.best > 0 ? '#4ade80' : 'rgba(148,163,184,0.3)' }}>${summary.best.toFixed(2)}</p>
                <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>Best Win</p>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-black" style={{ color: summary.worst < 0 ? '#f87171' : 'rgba(148,163,184,0.3)' }}>${Math.abs(summary.worst).toFixed(2)}</p>
                <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>Worst Loss</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {summary.emotions.map(e => (
                <span key={e} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${emotionColors[e] || ''}`}>
                  {EMOTION_LABELS[e] || e}
                </span>
              ))}
              {summary.setups.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                  background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                }}>{s}</span>
              ))}
              {summary.instruments.map(i => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium" style={{
                  background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
                }}>{i}</span>
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen size={14} style={{ color: 'rgba(148,163,184,0.5)' }} />
              <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>Sessions</span>
            </div>
            <div className="space-y-2">
              {dayTrades.map(t => <SessionCard key={t.id} session={t} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeReplay;
