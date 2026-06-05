import React, { useContext } from 'react';
import { TradingContext } from '../context/TradingContext';

function Header() {
  const { getTodaysPnL, getStreaks } = useContext(TradingContext);
  const todayPnL = getTodaysPnL();
  const streaks = getStreaks();

  const isUp = todayPnL >= 0;

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl border-b border-blue-800/40">

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-10 left-1/3 w-72 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-6 right-1/4 w-48 h-24 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                  <rect x="4" y="16" width="3" height="8" rx="0.5" fill="#fff" opacity="0.5"/>
                  <line x1="5.5" y1="13" x2="5.5" y2="16" stroke="white" strokeWidth="1" opacity="0.5"/>
                  <line x1="5.5" y1="24" x2="5.5" y2="27" stroke="white" strokeWidth="1" opacity="0.5"/>

                  <rect x="10" y="10" width="3" height="10" rx="0.5" fill="white" opacity="0.8"/>
                  <line x1="11.5" y1="7" x2="11.5" y2="10" stroke="white" strokeWidth="1" opacity="0.8"/>
                  <line x1="11.5" y1="20" x2="11.5" y2="23" stroke="white" strokeWidth="1" opacity="0.8"/>

                  <rect x="16" y="8" width="3" height="12" rx="0.5" fill="white"/>
                  <line x1="17.5" y1="5" x2="17.5" y2="8" stroke="white" strokeWidth="1"/>
                  <line x1="17.5" y1="20" x2="17.5" y2="23" stroke="white" strokeWidth="1"/>

                  <rect x="22" y="6" width="3" height="14" rx="0.5" fill="#67e8f9"/>
                  <line x1="23.5" y1="3" x2="23.5" y2="6" stroke="#67e8f9" strokeWidth="1"/>
                  <line x1="23.5" y1="20" x2="23.5" y2="23" stroke="#67e8f9" strokeWidth="1"/>

                  <polyline points="4,26 11,18 18,14 26,8"
                    stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <polygon points="26,8 22,9 25,12" fill="#67e8f9"/>
                </svg>
              </div>
              {/* Live pulse dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                  Trading P&L Tracker
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300 tracking-widest uppercase">
                  Live
                </span>
              </div>
              <p className="text-blue-300/70 text-xs font-medium mt-0.5 tracking-wide">
                Track · Analyze · Improve
              </p>
            </div>
          </div>

          {/* Right: Live stats pills */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Today's P&L pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold backdrop-blur-sm ${
              isUp
                ? 'bg-green-500/10 border-green-400/30 text-green-300'
                : 'bg-red-500/10 border-red-400/30 text-red-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs text-slate-400 font-normal">Today</span>
              <span>{isUp ? '+' : ''}${todayPnL.toFixed(2)}</span>
            </div>

            {/* Streak pill */}
            {streaks.currentStreak > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold backdrop-blur-sm ${
                streaks.currentStreakType === 'win'
                  ? 'bg-orange-500/10 border-orange-400/30 text-orange-300'
                  : 'bg-slate-500/10 border-slate-400/30 text-slate-300'
              }`}>
                <span>{streaks.currentStreakType === 'win' ? '🔥' : '❄️'}</span>
                <span>{streaks.currentStreak} streak</span>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
    </header>
  );
}

export default Header;