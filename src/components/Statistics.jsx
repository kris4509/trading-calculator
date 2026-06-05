import React, { useContext, useEffect, useRef } from 'react';
import { TradingContext } from '../context/TradingContext';

function RingChart({ value, max = 100, color = '#3b82f6', size = 80 }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((value / max) * 100, 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-animate"
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-white">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const end = parseFloat(value);
    if (isNaN(end)) { el.textContent = prefix + value + suffix; return; }
    const duration = 800;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (end * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span ref={ref}>{prefix}{value}{suffix}</span>;
}

function StatCard({ label, value, prefix = '', suffix = '', color, icon, sub, glowColor, barValue, decimals = 2 }) {
  return (
    <div
      className="glow-card animate-card relative overflow-hidden rounded-xl p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
        border: `1px solid ${glowColor || 'rgba(59,130,246,0.15)'}`,
        boxShadow: glowColor ? `0 0 20px ${glowColor}18` : 'none',
      }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" style={{
        background: `radial-gradient(circle at top right, ${glowColor || 'rgba(59,130,246,0.1)'} 0%, transparent 70%)`,
      }} />
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.6)' }}>
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-black mb-1" style={{ color: color || '#f1f5f9' }}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {sub && <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.5)' }}>{sub}</p>}
      {barValue !== undefined && (
        <div className="mt-3">
          <div className="w-full rounded-full" style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(barValue, 100)}%`,
                background: glowColor || '#3b82f6',
                boxShadow: `0 0 6px ${glowColor || '#3b82f6'}`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Statistics() {
  const { getStats, getTodaysSessions, trades, getStreaks } = useContext(TradingContext);
  const stats = getStats();
  const todayCount = getTodaysSessions().length;
  const streaks = getStreaks();

  const winRate = parseFloat(stats.winRate) / 100;
  const lossRate = 1 - winRate;
  const expectancy = ((winRate * parseFloat(stats.avgWin)) - (lossRate * parseFloat(stats.avgLoss))).toFixed(2);

  const dayMap = { 0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat' };
  const dayPnL = {}, dayCounts = {};
  trades.forEach(t => {
    const d = new Date(t.date + 'T12:00:00').getDay();
    dayPnL[d] = (dayPnL[d] || 0) + t.pnl;
    dayCounts[d] = (dayCounts[d] || 0) + 1;
  });
  const dayEntries = Object.entries(dayPnL)
    .map(([d, pnl]) => ({ day: dayMap[d], pnl, avg: pnl / dayCounts[d] }))
    .sort((a, b) => b.pnl - a.pnl);

  const sessionMap = {};
  trades.forEach(t => {
    const s = t.sessionName || 'Unknown';
    if (!sessionMap[s]) sessionMap[s] = { pnl: 0, count: 0, wins: 0 };
    sessionMap[s].pnl += t.pnl;
    sessionMap[s].count++;
    if (t.pnl > 0) sessionMap[s].wins++;
  });
  const sessionBreakdown = Object.entries(sessionMap)
    .map(([name, d]) => ({ name, ...d, winRate: ((d.wins / d.count) * 100).toFixed(0) }))
    .sort((a, b) => b.pnl - a.pnl);
  const maxSessionPnL = Math.max(...sessionBreakdown.map(s => Math.abs(s.pnl)), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)' }} />
        <div>
          <h2 className="text-2xl font-black text-white">Trading Statistics</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
            Deep performance analysis across {stats.totalTrades} trades
          </p>
        </div>
      </div>

      {stats.totalTrades === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(148,163,184,0.4)' }}>
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg font-semibold">No data yet</p>
          <p className="text-sm mt-1">Start adding sessions to see your statistics</p>
        </div>
      ) : (
        <>
          {/* Win Rate Ring + Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            <div
              className="glow-card rounded-xl p-6 flex flex-col items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(15,23,42,0.9) 100%)',
                border: '1px solid rgba(34,197,94,0.2)',
                boxShadow: '0 0 24px rgba(34,197,94,0.06)',
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.6)' }}>Win Rate</p>
              <RingChart value={parseFloat(stats.winRate)} color="#22c55e" size={96} />
              <p className="text-xs text-center" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {trades.filter(t => t.pnl > 0).length}W / {trades.filter(t => t.pnl < 0).length}L
              </p>
            </div>

            <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Trades" value={stats.totalTrades} decimals={0} icon="🔢" glowColor="rgba(59,130,246,0.3)" color="#60a5fa" sub="All recorded sessions" />
              <StatCard
                label="Profit Factor" value={stats.profitFactor} icon="⚡"
                glowColor={parseFloat(stats.profitFactor) >= 1.5 ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}
                color={parseFloat(stats.profitFactor) >= 1.5 ? "#4ade80" : "#f87171"}
                sub={parseFloat(stats.profitFactor) >= 2 ? "Excellent" : parseFloat(stats.profitFactor) >= 1 ? "Profitable" : "Needs work"}
                barValue={Math.min(parseFloat(stats.profitFactor) * 33, 100)}
              />
              <StatCard
                label="Expectancy" value={isNaN(expectancy) ? '0.00' : expectancy} prefix="$" icon="🎯"
                glowColor={parseFloat(expectancy) >= 0 ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}
                color={parseFloat(expectancy) >= 0 ? "#4ade80" : "#f87171"}
                sub="Expected profit per trade"
              />
            </div>
          </div>

          {/* Win / Loss grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Average Win"  value={stats.avgWin}  prefix="$" icon="💚" color="#4ade80" glowColor="rgba(34,197,94,0.25)"  sub="Per winning trade" />
            <StatCard label="Average Loss" value={stats.avgLoss} prefix="-$" icon="🔴" color="#f87171" glowColor="rgba(239,68,68,0.25)" sub="Per losing trade" />
            <StatCard label="Largest Win"  value={stats.largestWin} prefix="$" icon="🏆" color="#fbbf24" glowColor="rgba(251,191,36,0.25)" sub="Best single trade" />
            <StatCard label="Largest Loss" value={Math.abs(parseFloat(stats.largestLoss))} prefix="-$" icon="📉" color="#f87171" glowColor="rgba(239,68,68,0.2)" sub="Worst single trade" />
          </div>

          {/* Streak stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Today's Sessions" value={todayCount} suffix=" sessions" decimals={0} icon="📅" color="#a78bfa" glowColor="rgba(167,139,250,0.25)" sub="Logged today" />
            <StatCard label="Best Win Streak" value={streaks.longestWinStreak} suffix=" in a row" decimals={0} icon="🔥" color="#fb923c" glowColor="rgba(251,146,60,0.25)" sub="All time record" />
            <StatCard
              label="Current Streak" value={streaks.currentStreak}
              suffix={` ${streaks.currentStreakType === 'win' ? 'wins' : streaks.currentStreakType === 'loss' ? 'losses' : ''}`}
              decimals={0}
              icon={streaks.currentStreakType === 'win' ? '🔥' : streaks.currentStreakType === 'loss' ? '❄️' : '—'}
              color={streaks.currentStreakType === 'win' ? '#fb923c' : '#94a3b8'}
              glowColor={streaks.currentStreakType === 'win' ? 'rgba(251,146,60,0.25)' : undefined}
              sub="Active streak"
            />
          </div>

          {/* Day of week performance */}
          {dayEntries.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Performance by Day of Week
              </h3>
              <div className="rounded-xl overflow-hidden" style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(59,130,246,0.1)',
              }}>
                {dayEntries.map(({ day, pnl, avg }, i) => {
                  const maxAbs = Math.max(...dayEntries.map(d => Math.abs(d.pnl)), 1);
                  const pct = (Math.abs(pnl) / maxAbs) * 100;
                  const isPos = pnl >= 0;
                  return (
                    <div key={day} className="flex items-center gap-4 px-5 py-3"
                      style={{ borderBottom: i < dayEntries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span className="w-10 text-xs font-bold" style={{ color: 'rgba(148,163,184,0.7)' }}>{day}</span>
                      <div className="flex-1">
                        <div className="w-full rounded-full" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{
                            width: `${pct}%`,
                            background: isPos ? 'linear-gradient(90deg, #16a34a, #4ade80)' : 'linear-gradient(90deg, #dc2626, #f87171)',
                            boxShadow: isPos ? '0 0 6px rgba(74,222,128,0.4)' : '0 0 6px rgba(248,113,113,0.4)',
                          }} />
                        </div>
                      </div>
                      <span className={`text-sm font-bold tabular-nums w-20 text-right ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}${pnl.toFixed(2)}
                      </span>
                      <span className="text-xs w-20 text-right" style={{ color: 'rgba(148,163,184,0.4)' }}>
                        avg ${avg.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Session breakdown */}
          {sessionBreakdown.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Performance by Session
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sessionBreakdown.map(({ name, pnl, count, winRate }) => {
                  const isPos = pnl >= 0;
                  const icons = { Morning: '🌅', Afternoon: '☀️', Evening: '🌙' };
                  return (
                    <div key={name} className="glow-card rounded-xl p-4" style={{
                      background: isPos
                        ? 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(15,23,42,0.8) 100%)'
                        : 'linear-gradient(135deg, rgba(239,68,68,0.07) 0%, rgba(15,23,42,0.8) 100%)',
                      border: `1px solid ${isPos ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white">{icons[name] || '📊'} {name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                          background: isPos ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: isPos ? '#4ade80' : '#f87171',
                        }}>
                          {winRate}% WR
                        </span>
                      </div>
                      <p className={`text-2xl font-black ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}${pnl.toFixed(2)}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.5)' }}>{count} trade{count !== 1 ? 's' : ''}</p>
                      <div className="mt-3 w-full rounded-full" style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${(Math.abs(pnl) / maxSessionPnL) * 100}%`,
                          background: isPos ? '#22c55e' : '#ef4444',
                          boxShadow: `0 0 6px ${isPos ? '#22c55e' : '#ef4444'}`,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Statistics;