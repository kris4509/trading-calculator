import React, { useContext } from "react";
import { TradingContext } from "../context/TradingContext";
import { TrendingUp, TrendingDown, Award, Target, Flame, Zap } from "lucide-react";

function StreakTracker({ streaks }) {
  const { currentStreak, currentStreakType, longestWinStreak, longestLossStreak } = streaks;

  const isWinStreak = currentStreakType === 'win';
  const isLossStreak = currentStreakType === 'loss';
  const hasStreak = currentStreak > 0;

  const flames = Math.min(currentStreak, 7);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Flame size={20} className={isWinStreak ? "text-orange-500" : "text-slate-400"} />
        Streak Tracker
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Current Streak */}
        <div className={`rounded-xl p-5 text-center border-2 ${
          isWinStreak
            ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
            : isLossStreak
            ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700'
        }`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Current Streak
          </p>
          {hasStreak ? (
            <>
              <div className="flex justify-center mb-1">
                {Array.from({ length: flames }).map((_, i) => (
                  <span
                    key={i}
                    className="text-2xl"
                    style={{ opacity: 0.4 + (i / flames) * 0.6, transform: `scale(${0.7 + (i / flames) * 0.5})` }}
                  >
                    {isWinStreak ? '🔥' : '❄️'}
                  </span>
                ))}
              </div>
              <p className={`text-4xl font-black ${isWinStreak ? 'text-orange-500' : 'text-red-500'}`}>
                {currentStreak}
              </p>
              <p className={`text-sm font-semibold mt-1 ${isWinStreak ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                {isWinStreak ? 'Win' : 'Loss'}{currentStreak === 1 ? '' : 's'} in a row
              </p>
              {isWinStreak && currentStreak >= 3 && (
                <p className="text-xs text-orange-500 dark:text-orange-400 mt-2 font-medium animate-pulse">
                  🔥 You're on fire!
                </p>
              )}
              {isLossStreak && currentStreak >= 3 && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-medium">
                  ⚠️ Consider taking a break
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-4xl font-black text-gray-400 dark:text-gray-500">—</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No trades yet</p>
            </>
          )}
        </div>

        {/* Longest Win Streak */}
        <div className="rounded-xl p-5 text-center bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Best Win Streak
          </p>
          <div className="text-3xl mb-1">🏆</div>
          <p className="text-4xl font-black text-green-600 dark:text-green-400">{longestWinStreak}</p>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1 font-medium">
            {longestWinStreak === 0 ? 'No wins yet' : longestWinStreak === 1 ? 'win in a row' : 'wins in a row'}
          </p>
          {isWinStreak && currentStreak === longestWinStreak && longestWinStreak > 1 && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">
              ✨ Personal best!
            </p>
          )}
        </div>

        {/* Longest Loss Streak */}
        <div className="rounded-xl p-5 text-center bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Worst Loss Streak
          </p>
          <div className="text-3xl mb-1">📉</div>
          <p className="text-4xl font-black text-slate-600 dark:text-slate-300">{longestLossStreak}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {longestLossStreak === 0 ? 'No losses yet' : longestLossStreak === 1 ? 'loss in a row' : 'losses in a row'}
          </p>
          {longestLossStreak >= 5 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Review your strategy
            </p>
          )}
        </div>

      </div>

      {/* Streak progress bar */}
      {hasStreak && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{isWinStreak ? '🔥 Win streak progress' : '❄️ Loss streak'}</span>
            <span>
              {currentStreak} / {isWinStreak ? longestWinStreak || currentStreak : longestLossStreak || currentStreak} all-time {isWinStreak ? 'best' : 'worst'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${isWinStreak ? 'bg-orange-500' : 'bg-red-400'}`}
              style={{
                width: `${Math.min(
                  (currentStreak / Math.max(isWinStreak ? longestWinStreak : longestLossStreak, currentStreak)) * 100,
                  100
                )}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const {
    getTodaysPnL,
    getMonthlyPnL,
    getMonthlyProgress,
    getStats,
    getTodaysSessions,
    getStreaks,
    trades,
  } = useContext(TradingContext);

  const todayPnL = getTodaysPnL();
  const monthlyPnL = getMonthlyPnL();
  const progress = getMonthlyProgress();
  const stats = getStats();
  const streaks = getStreaks();

  // Get daily data for this month
  const dailyMap = {};
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  trades
    .filter((trade) => trade.date.startsWith(currentMonth))
    .forEach((trade) => {
      if (!dailyMap[trade.date]) dailyMap[trade.date] = 0;
      dailyMap[trade.date] += trade.pnl;
    });

  const dailyData = Object.entries(dailyMap)
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const bestDay = dailyData.length > 0
    ? dailyData.reduce((best, cur) => cur.pnl > best.pnl ? cur : best)
    : null;
  const worstDay = dailyData.length > 0
    ? dailyData.reduce((worst, cur) => cur.pnl < worst.pnl ? cur : worst)
    : null;

  // Max drawdown
  let maxDrawdown = 0, peak = 0, runningTotal = 0;
  [...trades]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .forEach((trade) => {
      runningTotal += trade.pnl;
      if (runningTotal > peak) peak = runningTotal;
      const drawdown = peak - runningTotal;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

  // Achievements
  const achievements = [];
  if (stats.winRate >= 50) achievements.push({ id: "balanced", name: "⚖️ Balanced Trader", desc: "50%+ win rate" });
  if (stats.winRate >= 70) achievements.push({ id: "winning", name: "🎯 Winning Streak", desc: "70%+ win rate" });
  if (progress.isTargetReached) achievements.push({ id: "target", name: "🏆 Target Master", desc: "Monthly target reached" });
  if (streaks.currentStreak >= 3 && streaks.currentStreakType === 'win') achievements.push({ id: "hot", name: "🔥 Hot Hand", desc: `${streaks.currentStreak} wins in a row` });
  if (stats.profitFactor >= 2) achievements.push({ id: "profitable", name: "💰 Profit Master", desc: "2.0+ profit factor" });
  if (stats.totalTrades >= 10) achievements.push({ id: "consistent", name: "📊 Consistent", desc: "10+ total trades" });
  if (todayPnL > 0) achievements.push({ id: "daily", name: "✨ Daily Profit", desc: "Profitable today" });
  if (streaks.longestWinStreak >= 5) achievements.push({ id: "legend", name: "🌟 Streak Legend", desc: "5+ win streak achieved" });

  const tradingTips = [
    "Consistency beats perfection - focus on small, repeated profits",
    "Track your best sessions - what made them successful?",
    "Accept losses gracefully - it's part of trading",
    "Set realistic targets - celebrate small wins",
    "Review your losing days - what can you improve?",
    "Win rate isn't everything - average win/loss matters more",
    "Every great trader started exactly where you are now",
    "Patience in trading is like compound interest in investing",
    "Your biggest enemy is not the market, it's your emotions",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Small daily progress compounds into extraordinary results",
    "Focus on what you can control: Your discipline and risk management",
    "Losses are lessons - extract the wisdom and move forward",
    "The only person you need to be better than is who you were yesterday",
    "Trading is a marathon, not a sprint - pace yourself",
  ];

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const dailyTip = tradingTips[dayOfYear % tradingTips.length];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to Your Trading Dashboard 📈</h2>
        <p className="text-blue-100">Track, analyze, and improve your trading performance every day</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Today's P&L</p>
          <p className={`text-3xl font-bold mt-2 ${todayPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${todayPnL.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Monthly P&L</p>
          <p className={`text-3xl font-bold mt-2 ${monthlyPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${monthlyPnL.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Win Rate</p>
          <p className="text-3xl font-bold mt-2 text-purple-600">{stats.winRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-amber-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Total Trades</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">{stats.totalTrades}</p>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Target size={20} className="text-blue-500" />
            Monthly Target Progress
          </h3>
          <span className="text-2xl font-bold text-blue-600">{progress.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all ${
              progress.isTargetReached ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress.progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ${progress.current} / ${progress.target.toFixed(2)} {progress.isTargetReached && "✅ Target Reached!"}
        </p>
      </div>

      {/* 🔥 Streak Tracker */}
      <StreakTracker streaks={streaks} />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Max Drawdown</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">${maxDrawdown.toFixed(2)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Largest peak decline</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Profit Factor</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.profitFactor}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Risk/Reward ratio</p>
        </div>
      </div>

      {/* Best & Worst Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <h4 className="font-bold text-green-600 mb-3">🏆 Best Day This Month</h4>
          {bestDay ? (
            <>
              <p className="text-2xl font-bold text-green-600">${bestDay.pnl.toFixed(2)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bestDay.date}</p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data yet</p>
          )}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <h4 className="font-bold text-red-600 mb-3">📉 Worst Day This Month</h4>
          {worstDay ? (
            <>
              <p className="text-2xl font-bold text-red-600">${worstDay.pnl.toFixed(2)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{worstDay.date}</p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data yet</p>
          )}
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award size={20} className="text-yellow-500" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 rounded p-3 border border-yellow-200 dark:border-yellow-700"
              >
                <p className="font-bold text-gray-800 dark:text-gray-100">{achievement.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-100">💡 Daily Motivation</h3>
        <p className="text-blue-800 dark:text-blue-100 italic text-lg">"{dailyTip}"</p>
      </div>

      {/* About */}
      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-3 text-indigo-900 dark:text-indigo-100">📊 About This Dashboard</h3>
        <p className="text-indigo-800 dark:text-indigo-200 mb-3">Your personal trading performance hub. This dashboard helps you:</p>
        <ul className="text-indigo-800 dark:text-indigo-200 space-y-2">
          <li>✅ Track daily, weekly, and monthly performance</li>
          <li>✅ Monitor win rates and profit streaks</li>
          <li>✅ Celebrate achievements and milestones</li>
          <li>✅ Identify patterns and improve trading</li>
          <li>✅ Stay motivated with goals and tips</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;