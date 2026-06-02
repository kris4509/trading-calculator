import React, { useContext } from "react";
import { TradingContext } from "../context/TradingContext";
import { TrendingUp, Award, Target, AlertCircle, Clock } from "lucide-react";

function Dashboard() {
  const { 
    getTodaysPnL, 
    getMonthlyPnL, 
    getMonthlyProgress,
    getStats,
    getTodaysSessions,
    trades,
  } = useContext(TradingContext);

  const todayPnL = getTodaysPnL();
  const monthlyPnL = getMonthlyPnL();
  const progress = getMonthlyProgress();
  const stats = getStats();
  const recentSessions = getTodaysSessions().slice(0, 5);

  // Calculate streaks manually
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl < 0);
  let winStreak = 0;
  for (let i = 0; i < trades.length; i++) {
    if (trades[i].pnl > 0) {
      winStreak++;
    } else {
      break;
    }
  }

  // Get daily data
  const dailyMap = {};
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  trades
    .filter((trade) => trade.date.startsWith(currentMonth))
    .forEach((trade) => {
      if (!dailyMap[trade.date]) {
        dailyMap[trade.date] = 0;
      }
      dailyMap[trade.date] += trade.pnl;
    });

  const dailyData = Object.entries(dailyMap)
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const bestDay = dailyData.length > 0 ? dailyData.reduce((best, current) => parseFloat(current.pnl) > parseFloat(best.pnl) ? current : best) : null;
  const worstDay = dailyData.length > 0 ? dailyData.reduce((worst, current) => parseFloat(current.pnl) < parseFloat(worst.pnl) ? current : worst) : null;

  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let runningTotal = 0;
  trades.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((trade) => {
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
  if (winStreak >= 3) achievements.push({ id: "hot", name: "🔥 Hot Hand", desc: `${winStreak} wins in a row` });
  if (stats.profitFactor >= 2) achievements.push({ id: "profitable", name: "💰 Profit Master", desc: "2.0+ profit factor" });
  if (stats.totalTrades >= 10) achievements.push({ id: "consistent", name: "📊 Consistent", desc: "10+ total trades" });
  if (todayPnL > 0) achievements.push({ id: "daily", name: "✨ Daily Profit", desc: "Profitable today" });

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
  
  // Get quote based on day to ensure it changes daily
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

      {/* Quick Stats Overview */}
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase">Win Streak</p>
          <p className="text-3xl font-bold mt-2 text-red-600">{winStreak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Consecutive wins</p>
        </div>
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
          <h4 className="font-bold text-green-600 mb-3">🏆 Best Day</h4>
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
          <h4 className="font-bold text-red-600 mb-3">📉 Worst Day</h4>
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
                className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 rounded p-3 border border-yellow-200 dark:border-yellow-700"
              >
                <p className="font-bold text-gray-800 dark:text-gray-100">{achievement.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trading Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-100">💡 Daily Motivation Quote</h3>
        <p className="text-blue-800 dark:text-blue-100 italic text-lg">"{dailyTip}"</p>
      </div>

      {/* About the App */}
      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-3 text-indigo-900 dark:text-indigo-100">📊 About This Dashboard</h3>
        <p className="text-indigo-800 dark:text-indigo-200 mb-3">
          Your personal trading performance hub. This dashboard helps you:
        </p>
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
