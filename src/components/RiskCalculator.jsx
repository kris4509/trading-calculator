import { useContext, useState, useMemo } from 'react';
import { TradingContext } from '../context/TradingContext';
import { AlertTriangle, Shield, TrendingUp, TrendingDown, DollarSign, Percent, Activity } from 'lucide-react';

const DERIV_INDICES = [
  { name: 'Volatility 10', minStake: 0.5, payout: 0.85 },
  { name: 'Volatility 25', minStake: 0.5, payout: 0.85 },
  { name: 'Volatility 50', minStake: 1, payout: 0.88 },
  { name: 'Volatility 75', minStake: 1, payout: 0.90 },
  { name: 'Volatility 100', minStake: 1, payout: 0.92 },
  { name: 'Volatility 150', minStake: 2, payout: 0.95 },
  { name: 'Volatility 250', minStake: 5, payout: 0.95 },
  { name: 'Boom 1000', minStake: 1, payout: 0.90 },
  { name: 'Crash 1000', minStake: 1, payout: 0.90 },
];

function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="rounded-xl p-4" style={{
      background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
      border: `1px solid ${color}25`,
    }}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={16} style={{ color }} />}
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.6)' }}>{label}</span>
      </div>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>{sub}</p>}
    </div>
  );
}

function RiskGauge({ value, max, label, good, warn, bad }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= bad ? '#ef4444' : pct >= warn ? '#f59e0b' : '#22c55e';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'rgba(148,163,184,0.6)' }}>{label}</span>
        <span className="font-bold" style={{ color }}>{value}{max > 999 ? '' : ` / ${max}`}</span>
      </div>
      <div className="w-full rounded-full h-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 8px ${color}50`,
        }} />
      </div>
    </div>
  );
}

function RiskCalculator() {
  const { trades, getStats, getTodaysPnL, getStreaks } = useContext(TradingContext);
  const stats = getStats();
  const todayPnL = getTodaysPnL();
  const streaks = getStreaks();

  const [balance, setBalance] = useState(1000);
  const [riskPerTrade, setRiskPerTrade] = useState(2);
  const [dailyLossLimit, setDailyLossLimit] = useState(5);
  const [selectedIndex, setSelectedIndex] = useState(2);

  const today = new Date().toISOString().split('T')[0];
  const todaysLosses = useMemo(() =>
    trades.filter(t => t.date === today && t.pnl < 0).reduce((s, t) => s + Math.abs(t.pnl), 0),
    [trades, today]
  );

  const index = DERIV_INDICES[selectedIndex];
  const maxStake = parseFloat((balance * (riskPerTrade / 100)).toFixed(2));
  const dailyLimit = parseFloat((balance * (dailyLossLimit / 100)).toFixed(2));
  const maxConsecutiveLosses = maxStake > 0 ? Math.floor(dailyLimit / maxStake) : 0;
  const riskExposure = ((todaysLosses / dailyLimit) * 100);
  const breakEvenRate = index ? ((1 / (1 + index.payout)) * 100).toFixed(1) : 55;
  const actualWinRate = stats.totalTrades > 0 ? parseFloat(stats.winRate) : 0;
  const isProfitable = actualWinRate > parseFloat(breakEvenRate);

  const riskLevel = riskExposure >= 80 ? 'critical' : riskExposure >= 50 ? 'warning' : 'safe';
  const riskColors = {
    safe: { text: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', label: 'Safe', icon: Shield },
    warning: { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Caution', icon: AlertTriangle },
    critical: { text: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', label: 'Critical', icon: TrendingDown },
  };
  const risk = riskColors[riskLevel];

  const recommendations = useMemo(() => {
    const tips = [];
    if (maxStake < 1) tips.push('Your max stake is below $1 — consider a higher balance or risk % to trade most indices.');
    if (maxConsecutiveLosses <= 2) tips.push(`Only ${maxConsecutiveLosses} losses would hit your daily limit. Consider lowering risk % or raising the daily limit.`);
    if (actualWinRate > 0 && !isProfitable) tips.push(`Your win rate (${actualWinRate}%) is below breakeven (${breakEvenRate}%). Review your strategy — you need ${breakEvenRate}% to break even with ${(index.payout * 100).toFixed(0)}% payout.`);
    if (actualWinRate > 0 && isProfitable) tips.push(`Your win rate (${actualWinRate}%) exceeds breakeven (${breakEvenRate}%). Your strategy is mathematically profitable.`);
    if (streaks.currentStreak >= 3 && streaks.currentStreakType === 'loss') tips.push('You\'re on a losing streak — consider halving your stake until the streak breaks.');
    if (maxStake > balance * 0.05) tips.push('Risking more than 5% per trade is aggressive. Most professionals risk 1-2%.');
    if (tips.length === 0) tips.push('Your risk parameters look reasonable. Stick to your plan and track consistently.');
    return tips;
  }, [maxStake, maxConsecutiveLosses, actualWinRate, isProfitable, breakEvenRate, index, balance, streaks]);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/30">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Risk Calculator</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>Position sizing & risk exposure for Deriv volatility indices</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="rounded-xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-blue-400" />
          Your Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(148,163,184,0.6)' }}>Account Balance ($)</label>
            <input type="number" value={balance} onChange={e => setBalance(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-2.5 rounded-lg text-white font-semibold outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '15px' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(148,163,184,0.6)' }}>Risk Per Trade (%)</label>
            <input type="number" value={riskPerTrade} onChange={e => setRiskPerTrade(Math.max(0.1, parseFloat(e.target.value) || 0))}
              step="0.5" min="0.1" max="100"
              className="w-full px-4 py-2.5 rounded-lg text-white font-semibold outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '15px' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(148,163,184,0.6)' }}>Daily Loss Limit (%)</label>
            <input type="number" value={dailyLossLimit} onChange={e => setDailyLossLimit(Math.max(0.1, parseFloat(e.target.value) || 0))}
              step="1" min="0.1" max="100"
              className="w-full px-4 py-2.5 rounded-lg text-white font-semibold outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '15px' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(148,163,184,0.6)' }}>Primary Index</label>
            <select value={selectedIndex} onChange={e => setSelectedIndex(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg text-white font-semibold outline-none transition-all appearance-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '15px' }}>
              {DERIV_INDICES.map((idx, i) => (
                <option key={i} value={i} className="bg-slate-800">{idx.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick presets for balance */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>Quick balance:</span>
          {[100, 500, 1000, 2500, 5000, 10000].map(p => (
            <button key={p} onClick={() => setBalance(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: balance === p ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${balance === p ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: balance === p ? '#60a5fa' : 'rgba(148,163,184,0.6)',
              }}>${p.toLocaleString()}</button>
          ))}
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Max Stake / Trade" value={`$${maxStake}`} sub={`${riskPerTrade}% of $${balance}`} color="#60a5fa" icon={DollarSign} />
        <StatCard label="Daily Loss Limit" value={`$${dailyLimit}`} sub={`${dailyLossLimit}% of balance`} color="#f59e0b" icon={Percent} />
        <StatCard label="Max Losses / Day" value={maxConsecutiveLosses} sub={`Before hitting limit`} color="#ef4444" icon={TrendingDown} />
        <StatCard label="Breakeven WR" value={`${breakEvenRate}%`} sub={`At ${(index.payout * 100).toFixed(0)}% payout`} color="#a78bfa" icon={Activity} />
      </div>

      {/* Index info */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <Activity size={16} style={{ color: 'rgba(148,163,184,0.5)' }} />
        <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>
          {index.name} — Min stake ${index.minStake} — ~{(index.payout * 100).toFixed(0)}% payout — 
          Your actual win rate: <strong style={{ color: isProfitable ? '#22c55e' : '#ef4444' }}>{actualWinRate || 'N/A'}%</strong>
          {actualWinRate > 0 && (isProfitable ? ' ✅ Profitable' : ' ❌ Below breakeven')}
        </span>
      </div>

      {/* Risk Exposure Gauge */}
      <div className="rounded-xl p-5" style={{
        background: `linear-gradient(135deg, ${risk.bg} 0%, rgba(15,23,42,0.8) 100%)`,
        border: `1px solid ${risk.border}`,
      }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <risk.icon size={16} style={{ color: risk.text }} />
            Current Risk Status
          </h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{
            background: risk.bg,
            color: risk.text,
            border: `1px solid ${risk.border}`,
          }}>{risk.label}</span>
        </div>

        <RiskGauge value={todaysLosses.toFixed(2)} max={dailyLimit} label="Today's Losses" good={0} warn={50} bad={80} />

        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-lg font-black" style={{ color: '#f87171' }}>${todaysLosses.toFixed(2)}</p>
            <p className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>Lost Today</p>
          </div>
          <div>
            <p className="text-lg font-black" style={{ color: risk.text }}>{riskExposure.toFixed(0)}%</p>
            <p className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>Limit Used</p>
          </div>
          <div>
            <p className="text-lg font-black" style={{ color: '#4ade80' }}>${Math.max(0, dailyLimit - todaysLosses).toFixed(2)}</p>
            <p className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>Remaining</p>
          </div>
        </div>
      </div>

      {/* Win Rate Reality Check */}
      {actualWinRate > 0 && (
        <div className="rounded-xl p-5" style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
          border: '1px solid rgba(59,130,246,0.12)',
        }}>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-400" />
            Win Rate Reality Check
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-lg font-black" style={{ color: isProfitable ? '#22c55e' : '#ef4444' }}>{stats.winRate}%</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Actual Win Rate</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-lg font-black" style={{ color: '#a78bfa' }}>{breakEvenRate}%</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>Breakeven WR Needed</p>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'rgba(148,163,184,0.5)' }}>
            {isProfitable
              ? `✅ Your actual win rate (${stats.winRate}%) is above breakeven. With ${(index.payout * 100).toFixed(0)}% payout, you only need ${breakEvenRate}% to be profitable.`
              : `⚠️ Your actual win rate (${stats.winRate}%) is below breakeven (${breakEvenRate}%). At ${(index.payout * 100).toFixed(0)}% payout, you need to win at least ${breakEvenRate}% of trades to break even.`}
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="rounded-xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(15,23,42,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.1)',
      }}>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-400" />
          Recommendations
        </h3>
        <ul className="space-y-2">
          {recommendations.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
              <span style={{ color: '#60a5fa' }}>{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RiskCalculator;
