import { useContext, useState, useMemo } from 'react';
import { TradingContext } from '../context/TradingContext';
import { Shield, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';

const RISK_LEVELS = [
  { label: 'Low', pct: 1, desc: 'Safe', color: '#22c55e' },
  { label: 'Medium', pct: 2, desc: 'Balanced', color: '#f59e0b' },
  { label: 'High', pct: 5, desc: 'Aggressive', color: '#ef4444' },
];

const LIMIT_PRESETS = [3, 5, 10, 20];

function RiskCalculator() {
  const { trades, getStreaks } = useContext(TradingContext);
  const streaks = getStreaks();

  const [balance, setBalance] = useState(1000);
  const [riskLevel, setRiskLevel] = useState(1);
  const [dailyLimitPct, setDailyLimitPct] = useState(5);

  const riskPct = RISK_LEVELS[riskLevel].pct;
  const riskLabel = RISK_LEVELS[riskLevel].label;
  const riskColor = RISK_LEVELS[riskLevel].color;

  const today = new Date().toISOString().split('T')[0];
  const todaysLosses = useMemo(() =>
    trades.filter(t => t.date === today && t.pnl < 0).reduce((s, t) => s + Math.abs(t.pnl), 0),
    [trades, today]
  );

  const maxStake = parseFloat((balance * (riskPct / 100)).toFixed(2));
  const dailyLimit = parseFloat((balance * (dailyLimitPct / 100)).toFixed(2));
  const maxConsecutive = maxStake > 0 ? Math.floor(dailyLimit / maxStake) : 0;
  const riskExposure = dailyLimit > 0 ? (todaysLosses / dailyLimit) * 100 : 0;

  const statusLevel = riskExposure >= 80 ? 'critical' : riskExposure >= 50 ? 'warning' : 'safe';
  const statusConfig = {
    safe: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', label: 'Safe', icon: Shield },
    warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Caution', icon: AlertTriangle },
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', label: 'Critical', icon: TrendingDown },
  };
  const status = statusConfig[statusLevel];

  const tips = useMemo(() => {
    const t = [];
    if (maxConsecutive <= 2) t.push(`Only ${maxConsecutive} losses hits your daily limit. Lower your risk or raise the limit.`);
    if (streaks.currentStreak >= 3 && streaks.currentStreakType === 'loss') t.push('On a losing streak — halve your stake until it breaks.');
    if (t.length === 0) t.push('Your risk settings look sensible. Stick to the plan.');
    return t;
  }, [maxConsecutive, streaks]);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/30">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Risk Calculator</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>Know your limits before you trade</p>
        </div>
      </div>

      {/* Balance */}
      <div className="rounded-xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(148,163,184,0.6)' }}>ACCOUNT BALANCE ($)</label>
        <input type="number" value={balance} onChange={e => setBalance(Math.max(1, parseFloat(e.target.value) || 0))}
          className="w-full px-4 py-3 rounded-lg text-white font-bold outline-none transition-all text-lg"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '18px' }}
          onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'} />
        <div className="flex flex-wrap gap-2 mt-3">
          {[100, 500, 1000, 2500, 5000, 10000].map(p => (
            <button key={p} onClick={() => setBalance(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: balance === p ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${balance === p ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: balance === p ? '#60a5fa' : 'rgba(148,163,184,0.6)',
              }}>${p.toLocaleString()}</button>
          ))}
        </div>
      </div>

      {/* Risk Level */}
      <div className="rounded-xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <label className="text-xs font-semibold mb-3 block" style={{ color: 'rgba(148,163,184,0.6)' }}>RISK LEVEL — <span style={{ color: riskColor }}>{riskLabel}</span> ({riskPct}% per trade)</label>
        <div className="flex gap-2">
          {RISK_LEVELS.map((lvl, i) => (
            <button key={lvl.label} onClick={() => setRiskLevel(i)}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: riskLevel === i ? `${lvl.color}20` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${riskLevel === i ? lvl.color : 'rgba(255,255,255,0.08)'}`,
                color: riskLevel === i ? lvl.color : 'rgba(148,163,184,0.5)',
              }}>
              {lvl.label}
              <div className="text-xs font-normal mt-0.5 opacity-70">{lvl.desc}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(148,163,184,0.6)' }}>DAILY LOSS LIMIT</label>
          <div className="flex gap-2">
            {LIMIT_PRESETS.map(p => (
              <button key={p} onClick={() => setDailyLimitPct(p)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: dailyLimitPct === p ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${dailyLimitPct === p ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: dailyLimitPct === p ? '#60a5fa' : 'rgba(148,163,184,0.5)',
                }}>{p}%</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Max Stake', value: `$${maxStake}`, sub: `${riskPct}% of balance`, color: '#60a5fa' },
          { label: 'Daily Limit', value: `$${dailyLimit}`, sub: `${dailyLimitPct}% of balance`, color: '#f59e0b' },
          { label: 'Max Losses', value: maxConsecutive, sub: 'Before stopping', color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
            border: `1px solid ${s.color}25`,
          }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>{s.label}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.35)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Risk Gauge */}
      <div className="rounded-xl p-5" style={{
        background: `linear-gradient(135deg, ${status.bg} 0%, rgba(15,23,42,0.8) 100%)`,
        border: `1px solid ${status.border}`,
      }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <status.icon size={16} style={{ color: status.color }} />
            Today's Risk
          </h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{
            background: status.bg, color: status.color, border: `1px solid ${status.border}`,
          }}>{status.label}</span>
        </div>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(148,163,184,0.5)' }}>
          <span>Lost today</span>
          <span className="font-bold" style={{ color: status.color }}>
            ${todaysLosses.toFixed(2)} of ${dailyLimit.toFixed(2)}
          </span>
        </div>
        <div className="w-full rounded-full h-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${Math.min(riskExposure, 100)}%`,
            background: status.color,
            boxShadow: `0 0 8px ${status.color}50`,
          }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Lost', value: `$${todaysLosses.toFixed(2)}`, color: '#f87171' },
            { label: 'Limit Used', value: `${riskExposure.toFixed(0)}%`, color: status.color },
            { label: 'Remaining', value: `$${Math.max(0, dailyLimit - todaysLosses).toFixed(2)}`, color: '#4ade80' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="rounded-xl p-4" style={{
          background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)',
        }}>
          <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-yellow-400" /> Tips
          </h3>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RiskCalculator;
