import { useContext, useState, useMemo } from 'react';
import { TradingContext } from '../context/TradingContext';
import { Shield, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

const MARTINGALE_OPTIONS = [2, 3, 4];
const LOSS_OPTIONS = [3, 4, 5, 6];
const PAYOUT_OPTIONS = [
  { label: 'Vol 10/25', pct: 85 },
  { label: 'Vol 50', pct: 88 },
  { label: 'Vol 75/100', pct: 90 },
  { label: 'Boom/Crash', pct: 92 },
  { label: 'Vol 150/250', pct: 95 },
];

function NumberPad({ value, onChange }) {
  const handleTap = (digit) => {
    if (digit === 'C') { onChange(''); return; }
    if (digit === '.' && value.includes('.')) return;
    const next = value + digit;
    if (parseFloat(next) > 99999) return;
    onChange(next);
  };

  const keys = [
    ['7','8','9'],
    ['4','5','6'],
    ['1','2','3'],
    ['C','0','.'],
  ];

  return (
    <div className="select-none">
      <div className="mb-3">
        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(148,163,184,0.6)' }}>BASE STAKE ($)</label>
        <div className="w-full px-4 py-3 rounded-lg text-white font-bold text-lg" style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)',
        }}>
          {value ? `$${parseFloat(value).toFixed(2)}` : '$0.00'}
        </div>
      </div>
      {keys.map((row, ri) => (
        <div key={ri} className="flex gap-1.5 mb-1.5">
          {row.map(key => (
            <button key={key} onClick={() => handleTap(key)}
              className="flex-1 py-3 rounded-xl text-lg font-bold transition-all active:scale-95"
              style={{
                background: key === 'C' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${key === 'C' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
                color: key === 'C' ? '#f87171' : 'rgba(226,232,240,0.9)',
              }}>{key}</button>
          ))}
        </div>
      ))}
    </div>
  );
}

function RiskCalculator() {
  const { trades, getStreaks } = useContext(TradingContext);
  const streaks = getStreaks();

  const [balance, setBalance] = useState(1000);
  const [stakeInput, setStakeInput] = useState('0.35');
  const [martingale, setMartingale] = useState(2);
  const [planLosses, setPlanLosses] = useState(3);
  const [payoutIdx, setPayoutIdx] = useState(2);

  const stake = parseFloat(stakeInput) || 0;

  const sequence = useMemo(() => {
    const seq = [];
    let s = stake;
    for (let i = 0; i < planLosses; i++) {
      seq.push(parseFloat(s.toFixed(2)));
      s *= martingale;
    }
    return seq;
  }, [stake, martingale, planLosses]);

  const requiredCapital = parseFloat(sequence.reduce((sum, s) => sum + s, 0).toFixed(2));
  const payoutPct = PAYOUT_OPTIONS[payoutIdx].pct;
  const takeProfit = parseFloat((stake * (payoutPct / 100)).toFixed(2));
  const takeProfitPct = payoutPct;
  const stopLoss = requiredCapital;

  const today = new Date().toISOString().split('T')[0];
  const todaysLosses = useMemo(() =>
    trades.filter(t => t.date === today && t.pnl < 0).reduce((s, t) => s + Math.abs(t.pnl), 0),
    [trades, today]
  );
  const dailyLimit = parseFloat((balance * 0.05).toFixed(2));
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
    if (requiredCapital > balance * 0.5) t.push(`Required capital ($${requiredCapital}) is over 50% of your balance. Lower your base stake or plan for fewer losses.`);
    if (stake < 0.5) t.push('Most Deriv indices have a $0.50 minimum stake.');
    if (streaks.currentStreak >= 3 && streaks.currentStreakType === 'loss') t.push('On a losing streak — review your strategy before continuing martingale.');
    if (t.length === 0) t.push('Martingale increases risk after each loss. Keep your base stake small and plan for the worst case.');
    return t;
  }, [requiredCapital, balance, stake, streaks]);

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/30">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Risk Calculator</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>Martingale planner & position sizing</p>
        </div>
      </div>

      {/* Balance */}
      <div className="rounded-xl p-4" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(148,163,184,0.6)' }}>ACCOUNT BALANCE ($)</label>
        <input type="number" value={balance} onChange={e => setBalance(Math.max(1, parseFloat(e.target.value) || 0))}
          className="w-full px-4 py-2.5 rounded-lg text-white font-bold outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'} />
        <div className="flex flex-wrap gap-1.5 mt-2">
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

      {/* Number Pad + Stake */}
      <div className="rounded-xl p-4" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <NumberPad value={stakeInput} onChange={setStakeInput} />
      </div>

      {/* Martingale & Losses & Payout */}
      <div className="rounded-xl p-4" style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.12)',
      }}>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(148,163,184,0.6)' }}>MARTINGALE</label>
            <div className="flex gap-1.5">
              {MARTINGALE_OPTIONS.map(m => (
                <button key={m} onClick={() => setMartingale(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all`}
                  style={{
                    background: martingale === m ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${martingale === m ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: martingale === m ? '#60a5fa' : 'rgba(148,163,184,0.5)',
                  }}>x{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(148,163,184,0.6)' }}>LOSSES</label>
            <div className="flex gap-1.5">
              {LOSS_OPTIONS.map(n => (
                <button key={n} onClick={() => setPlanLosses(n)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all`}
                  style={{
                    background: planLosses === n ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${planLosses === n ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: planLosses === n ? '#60a5fa' : 'rgba(148,163,184,0.5)',
                  }}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(148,163,184,0.6)' }}>PAYOUT</label>
            <div className="flex gap-1.5 flex-wrap">
              {PAYOUT_OPTIONS.map((opt, i) => (
                <button key={i} onClick={() => setPayoutIdx(i)}
                  className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all`}
                  style={{
                    background: payoutIdx === i ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${payoutIdx === i ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: payoutIdx === i ? '#60a5fa' : 'rgba(148,163,184,0.5)',
                  }}>{opt.label}<br /><span style={{ fontSize: '9px' }}>{opt.pct}%</span></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Take Profit', value: `$${takeProfit}`, sub: `${takeProfitPct}% payout`, color: '#22c55e' },
          { label: 'Stop Loss', value: `$${stopLoss}`, sub: `${planLosses} loss streak`, color: '#ef4444' },
          { label: 'Required Capital', value: `$${requiredCapital}`, sub: `${((requiredCapital / balance) * 100).toFixed(1)}% of balance`, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
            border: `1px solid ${s.color}25`,
          }}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>{s.label}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.35)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Stake Sequence */}
      {stake > 0 && (
        <div className="rounded-xl p-4" style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
          border: '1px solid rgba(59,130,246,0.12)',
        }}>
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'rgba(148,163,184,0.6)' }}>STAKE SEQUENCE ({planLosses} losses at x{martingale})</h3>
          <div className="flex flex-wrap gap-2">
            {sequence.map((s, i) => {
              const barWidth = ((s / sequence[sequence.length - 1]) * 100);
              return (
                <div key={i} className="flex-1 min-w-[60px]">
                  <div className="rounded-lg p-2.5 text-center" style={{
                    background: i === sequence.length - 1 ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.08)',
                    border: `1px solid ${i === sequence.length - 1 ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.15)'}`,
                  }}>
                    <p className="text-sm font-bold" style={{ color: i === sequence.length - 1 ? '#f87171' : '#60a5fa' }}>${s.toFixed(2)}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>Loss #{i + 1}</p>
                  </div>
                  <div className="mt-1 w-full rounded-full h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{
                      width: `${barWidth}%`,
                      background: i === sequence.length - 1 ? '#ef4444' : '#3b82f6',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>
            <span>Start: ${sequence[0]?.toFixed(2)}</span>
            <span>Peak: ${sequence[sequence.length - 1]?.toFixed(2)}</span>
            <span>Total: ${requiredCapital}</span>
          </div>
        </div>
      )}

      {/* Risk Gauge */}
      <div className="rounded-xl p-4" style={{
        background: `linear-gradient(135deg, ${status.bg} 0%, rgba(15,23,42,0.8) 100%)`,
        border: `1px solid ${status.border}`,
      }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <status.icon size={16} style={{ color: status.color }} />
            Today's Risk (5% daily limit)
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
            background: status.bg, color: status.color, border: `1px solid ${status.border}`,
          }}>{status.label}</span>
        </div>
        <div className="w-full rounded-full h-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${Math.min(riskExposure, 100)}%`,
            background: status.color,
            boxShadow: `0 0 8px ${status.color}50`,
          }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            { label: 'Lost Today', value: `$${todaysLosses.toFixed(2)}`, color: '#f87171' },
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
