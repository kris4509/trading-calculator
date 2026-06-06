const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const intentPatterns = [
  {
    name: 'day_of_week',
    patterns: [
      /(friday|monday|tuesday|wednesday|thursday|saturday|sunday)/i,
      /day of week/i, /weekday/i, /weekend/i, /what days/i,
      /best day/i, /worst day/i, /why.*(losing|lose|loss).*(friday|monday|tuesday)/i,
    ],
    keywords: ['day', 'days', 'friday', 'monday', 'weekday', 'weekend'],
  },
  {
    name: 'setup',
    patterns: [
      /(setup|setups|strategy|strategies)/i,
      /(breakout|reversal|scalp|trend|news|range)/i,
      /best.*setup/i, /what.*(trade|setup)/i, /which.*setup/i,
    ],
    keywords: ['setup', 'setups', 'strategy', 'strategies', 'breakout', 'reversal', 'scalp'],
  },
  {
    name: 'emotion',
    patterns: [
      /(emotion|feeling|feel|mood|psychology|mental|anxious|calm|fomo|revenge|confident)/i,
      /how.*(emotion|feel)/i, /(emotion|feel).*affect/i,
    ],
    keywords: ['emotion', 'feel', 'feeling', 'mood', 'anxious', 'calm', 'fomo', 'revenge', 'confident', 'psychology'],
  },
  {
    name: 'session_time',
    patterns: [
      /(morning|afternoon|evening|session)/i,
      /what.*(session|time)/i, /best.*(session|time)/i,
    ],
    keywords: ['morning', 'afternoon', 'evening', 'session', 'time of day'],
  },
  {
    name: 'overall',
    patterns: [
      /(how.*(doing|going|performing)|overall|performance.*summary|give.*overview)/i,
      /how am i/i, /how are we/i,
    ],
    keywords: ['overall', 'summary', 'overview', 'performance'],
  },
  {
    name: 'win_rate',
    patterns: [
      /(win rate|winrate|winning|success rate|how often)/i,
      /what.*(win|winning)/i, /(win|loss).*ratio/i,
    ],
    keywords: ['win rate', 'winrate', 'winning', 'success rate', 'win ratio'],
  },
  {
    name: 'streak',
    patterns: [
      /(streak|losing.*streak|win.*streak|on fire|hot streak|losing streak)/i,
      /(what.*streak|current.*streak)/i,
    ],
    keywords: ['streak', 'run', 'winning streak', 'losing streak'],
  },
  {
    name: 'monthly',
    patterns: [
      /(month|monthly|target|goal|progress)/i,
      /how.*(month|target|goal)/i, /(hit.*target|reach.*goal)/i,
    ],
    keywords: ['monthly', 'month', 'target', 'goal', 'progress'],
  },
  {
    name: 'profit_factor',
    patterns: [
      /(profit factor|risk.*reward|risk reward|expectancy|rr)/i,
      /what.*(profit factor|expectancy|risk)/i,
    ],
    keywords: ['profit factor', 'risk reward', 'expectancy', 'risk/reward'],
  },
  {
    name: 'best_worst',
    patterns: [
      /(biggest|largest|best|worst).*(win|loss|trade|day)/i,
      /(best|worst).*(trade|session|day)/i,
      /record/i,
    ],
    keywords: ['biggest', 'largest', 'best', 'worst', 'record'],
  },
  {
    name: 'advice',
    patterns: [
      /(advice|suggest|tip|help|improve|should|recommend)/i,
      /what should i/i, /how can i/i, /give me.*(tip|advice)/i,
    ],
    keywords: ['advice', 'suggest', 'tip', 'improve', 'recommend', 'help'],
  },
  {
    name: 'trend',
    patterns: [
      /(trend|improving|getting better|declining|consistent)/i,
      /(am i.*getting|are we.*improving)/i,
      /month.*(over|compare|trend)/i,
    ],
    keywords: ['trend', 'improving', 'declining', 'consistent', 'progressing'],
  },
];

function scoreIntent(question, intent) {
  const q = question.toLowerCase();
  let score = 0;
  for (const pattern of intent.patterns) {
    if (pattern.test(q)) score += 2;
  }
  for (const kw of intent.keywords) {
    if (q.includes(kw.toLowerCase())) score += 1;
  }
  return score;
}

function detectIntent(question) {
  let best = { name: 'fallback', score: 0 };
  for (const intent of intentPatterns) {
    const score = scoreIntent(question, intent);
    if (score > best.score) best = { name: intent.name, score };
  }
  return best.name;
}

function getDayOfWeekData(trades) {
  const dayMap = {};
  for (let i = 0; i < 7; i++) {
    dayMap[i] = { pnl: 0, count: 0, wins: 0, losses: 0 };
  }
  trades.forEach(t => {
    const d = new Date(t.date + 'T12:00:00').getDay();
    dayMap[d].pnl += t.pnl;
    dayMap[d].count++;
    if (t.pnl > 0) dayMap[d].wins++;
    else if (t.pnl < 0) dayMap[d].losses++;
  });
  return Object.entries(dayMap).map(([idx, data]) => ({
    day: dayNames[idx],
    dayAbbr: dayAbbr[idx],
    ...data,
    avg: data.count > 0 ? (data.pnl / data.count).toFixed(2) : 0,
    winRate: data.count > 0 ? ((data.wins / data.count) * 100).toFixed(1) : 0,
  }));
}

function getSetupData(trades) {
  const map = {};
  trades.forEach(t => {
    const s = t.setup || 'Unspecified';
    if (!map[s]) map[s] = { pnl: 0, count: 0, wins: 0 };
    map[s].pnl += t.pnl;
    map[s].count++;
    if (t.pnl > 0) map[s].wins++;
  });
  return Object.entries(map)
    .map(([name, d]) => ({ name, ...d, winRate: ((d.wins / d.count) * 100).toFixed(1) }))
    .sort((a, b) => b.pnl - a.pnl);
}

function getEmotionData(trades) {
  const map = {};
  trades.forEach(t => {
    if (!t.emotion) return;
    if (!map[t.emotion]) map[t.emotion] = { pnl: 0, count: 0, wins: 0 };
    map[t.emotion].pnl += t.pnl;
    map[t.emotion].count++;
    if (t.pnl > 0) map[t.emotion].wins++;
  });
  return Object.entries(map)
    .map(([name, d]) => ({ name, ...d, winRate: ((d.wins / d.count) * 100).toFixed(1) }))
    .sort((a, b) => b.pnl - a.pnl);
}

function getSessionTimeData(trades) {
  const map = {};
  trades.forEach(t => {
    const s = t.sessionName || 'Unknown';
    if (!map[s]) map[s] = { pnl: 0, count: 0, wins: 0 };
    map[s].pnl += t.pnl;
    map[s].count++;
    if (t.pnl > 0) map[s].wins++;
  });
  return Object.entries(map)
    .map(([name, d]) => ({ name, ...d, winRate: ((d.wins / d.count) * 100).toFixed(1) }))
    .sort((a, b) => b.pnl - a.pnl);
}

function getMonthlyTrend(trades) {
  const map = {};
  trades.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!map[m]) map[m] = 0;
    map[m] += t.pnl;
  });
  return Object.entries(map)
    .map(([m, pnl]) => ({ month: m, pnl }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function getConsistencyScore(trades) {
  if (trades.length < 3) return { score: 0, label: 'Not enough data' };
  const dailyMap = {};
  trades.forEach(t => {
    dailyMap[t.date] = (dailyMap[t.date] || 0) + t.pnl;
  });
  const dailyPnLs = Object.values(dailyMap);
  const avg = dailyPnLs.reduce((s, v) => s + v, 0) / dailyPnLs.length;
  const variance = dailyPnLs.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / dailyPnLs.length;
  const stdDev = Math.sqrt(variance);
  const score = avg !== 0 ? Math.max(0, Math.min(100, (1 - stdDev / Math.abs(avg)) * 50 + 50)) : 0;
  let label = 'Needs improvement';
  if (score >= 80) label = 'Excellent consistency';
  else if (score >= 60) label = 'Good consistency';
  else if (score >= 40) label = 'Moderate consistency';
  return { score: Math.round(score), label, avgDaily: avg.toFixed(2), stdDev: stdDev.toFixed(2) };
}

function generateAdvice(trades, stats, streaks, consistency) {
  const tips = [];
  const dayData = getDayOfWeekData(trades);
  const worstDay = [...dayData].sort((a, b) => a.avg - b.avg)[0];
  const bestDay = [...dayData].sort((a, b) => b.avg - b.avg)[0];

  if (stats.winRate < 40) tips.push('Your win rate is below 40%. Focus on higher-probability setups and consider tightening your entry criteria.');
  if (stats.avgWin && stats.avgLoss && parseFloat(stats.avgWin) < parseFloat(stats.avgLoss) * 1.5) {
    tips.push('Your average win is less than 1.5x your average loss. Let winners run longer or cut losses sooner to improve your risk/reward ratio.');
  }
  if (worstDay && worstDay.avg < -10) tips.push(`Your worst day is ${worstDay.day} (avg ${worstDay.avg}). Consider reducing position size or avoiding trading on ${worstDay.day}s.`);
  if (parseFloat(stats.profitFactor) < 1) tips.push('Your profit factor is below 1.0 — you\'re losing more than you make. Step back and review your strategy.');
  if (streaks.currentStreak >= 3 && streaks.currentStreakType === 'loss') tips.push('You\'re on a losing streak. Take a break, review your recent trades, and wait for clear setups before trading again.');
  if (parseFloat(stats.profitFactor) >= 2) tips.push('Excellent profit factor! You\'re managing risk well. Keep doing what you\'re doing.');
  if (streaks.longestWinStreak >= 5) tips.push(`Your record win streak is ${streaks.longestWinStreak} — you have what it takes to be consistent. Replicate those conditions.`);
  if (bestDay && bestDay.avg > 0) tips.push(`Your best day is ${bestDay.day}. Analyze what makes that day work and try to replicate those conditions.`);
  if (consistency.score < 40) tips.push('Your consistency score is low. Aim for smaller, more consistent daily results rather than big swings.');
  if (consistency.score >= 80) tips.push('Your consistency is excellent! You\'re building a sustainable trading habit.');

  if (tips.length === 0) {
    tips.push('Keep tracking your trades consistently — the more data you have, the better insights we can generate.');
    tips.push('Review your journal entries regularly to identify patterns in your best and worst trades.');
  }
  return tips;
}

function formatCurrency(val) {
  const sign = val >= 0 ? '+' : '';
  return `${sign}$${Math.abs(val).toFixed(2)}`;
}

const emotionLabelMap = {
  calm: 'Calm 😌', confident: 'Confident 💪', anxious: 'Anxious 😰',
  fomo: 'FOMO 😤', revenge: 'Revenge 😡', disciplined: 'Disciplined 🎯',
};

export function analyzeQuestion(question, trades, contextFns) {
  const { getStats, getMonthlyProgress, getStreaks, getMonthlyPnL } = contextFns;
  const stats = getStats();
  const progress = getMonthlyProgress();
  const streaks = getStreaks();
  const monthlyPnL = getMonthlyPnL();
  const intent = detectIntent(question);

  if (trades.length === 0) {
    return { text: "You haven't recorded any trades yet. Head over to the **Sessions** tab to add your first trading session. Once you have some data, I'll be able to analyze your performance and give you personalized insights!", data: null, intent: 'empty' };
  }

  const consistency = getConsistencyScore(trades);

  let result;

  switch (intent) {
    case 'day_of_week': {
      const dayData = getDayOfWeekData(trades);
      const hasData = dayData.some(d => d.count > 0);
      if (!hasData) return { text: 'No day-of-week data available yet.', data: null };

      const sorted = [...dayData].filter(d => d.count > 0).sort((a, b) => b.pnl - a.pnl);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      const specificDay = intentPatterns.find(i => i.name === 'day_of_week').patterns
        .some(p => {
          const match = question.match(p);
          return match && dayNames.some(d => d.toLowerCase() === match[0]?.toLowerCase());
        });

      if (specificDay) {
        const dayMatch = dayNames.find(d => question.toLowerCase().includes(d.toLowerCase()));
        if (dayMatch) {
          const idx = dayNames.indexOf(dayMatch);
          const data = dayData[idx];
          if (data.count > 0) {
            result = `On **${dayMatch}** you've made ${data.count} trades:\n\n`;
            result += `📊 **Total P&L:** ${formatCurrency(data.pnl)}\n`;
            result += `📈 **Avg P&L:** ${formatCurrency(parseFloat(data.avg))} per trade\n`;
            result += `✅ **Win Rate:** ${data.winRate}% (${data.wins}W / ${data.losses}L)\n\n`;
            if (parseFloat(data.avg) < 0) {
              result += `💡 Looks like ${dayMatch} is a challenging day. Consider smaller position sizes or reviewing your ${dayMatch} strategy.`;
            } else {
              result += `💡 ${dayMatch} is working well for you. Keep doing what you're doing!`;
            }
          } else {
            result = `You haven't traded on **${dayMatch}** yet.`;
          }
        }
      } else {
        result = `Here's your performance by day of the week:\n\n`;
        const bestDay = sorted[0];
        const worstDay = sorted[sorted.length - 1];
        dayData.filter(d => d.count > 0).forEach(d => {
          const emoji = d === best ? '🏆' : d === worst && d.pnl < 0 ? '📉' : d.pnl >= 0 ? '✅' : '❌';
          result += `${emoji} **${d.day}:** ${formatCurrency(d.pnl)} (${d.winRate}% WR, ${d.count} trades)\n`;
        });
        result += `\n💡 Best day: **${bestDay.day}** (${formatCurrency(bestDay.pnl)})\n`;
        if (worstDay.pnl < 0) result += `💡 Toughest day: **${worstDay.day}** (${formatCurrency(worstDay.pnl)})`;
      }
      return { text: result, data: dayData, intent };
    }

    case 'setup': {
      const setupData = getSetupData(trades).filter(s => s.name !== 'Unspecified');
      if (setupData.length === 0) return { text: "You haven't logged any setups yet. When adding sessions, try selecting a **Setup Type** in the journal section so I can analyze which setups work best for you!", data: null };

      const best = setupData[0];
      const worst = setupData[setupData.length - 1];

      result = `Here's your setup performance:\n\n`;
      setupData.forEach(s => {
        const emoji = s.pnl > 0 ? '✅' : '❌';
        result += `${emoji} **${s.name}:** ${formatCurrency(s.pnl)} (${s.winRate}% WR, ${s.count} trades)\n`;
      });
      result += `\n🏆 **Best setup:** ${best.name} (${formatCurrency(best.pnl)}, ${best.winRate}% WR)\n`;
      if (worst.pnl < 0) result += `📉 **Worst setup:** ${worst.name} (${formatCurrency(worst.pnl)}, ${worst.winRate}% WR)\n`;
      result += `\n💡 Your best setup is **${best.name}** with a ${best.winRate}% win rate. Focus on this pattern.`;
      return { text: result, data: setupData, intent };
    }

    case 'emotion': {
      const emotionData = getEmotionData(trades);
      if (emotionData.length === 0) return { text: "You haven't logged any emotions yet. When adding sessions, select your **Emotional State** in the journal so I can analyze how emotions affect your trading!", data: null };

      const best = emotionData[0];
      const worst = emotionData[emotionData.length - 1];

      result = `Here's how your emotions correlate with performance:\n\n`;
      emotionData.forEach(e => {
        const label = emotionLabelMap[e.name] || e.name;
        const emoji = e.pnl > 0 ? '✅' : '❌';
        result += `${emoji} **${label}:** ${formatCurrency(e.pnl)} (${e.winRate}% WR, ${e.count} trades)\n`;
      });
      result += `\n🏆 **Best emotional state:** ${emotionLabelMap[best.name] || best.name} (${formatCurrency(best.pnl)})\n`;
      if (worst.pnl < 0) result += `📉 **Worst emotional state:** ${emotionLabelMap[worst.name] || worst.name} (${formatCurrency(worst.pnl)})\n`;
      result += `\n💡 You perform best when feeling **${emotionLabelMap[best.name] || best.name}**. Try to cultivate this mindset before trading.`;
      return { text: result, data: emotionData, intent };
    }

    case 'session_time': {
      const sessionData = getSessionTimeData(trades);
      if (sessionData.length === 0) return { text: 'No session time data available.', data: null };

      const best = sessionData[0];
      const worst = sessionData[sessionData.length - 1];

      const icons = { Morning: '🌅', Afternoon: '☀️', Evening: '🌙' };
      result = `Here's your performance by session time:\n\n`;
      sessionData.forEach(s => {
        const icon = icons[s.name] || '📊';
        const emoji = s.pnl > 0 ? '✅' : '❌';
        result += `${icon} ${emoji} **${s.name}:** ${formatCurrency(s.pnl)} (${s.winRate}% WR, ${s.count} trades)\n`;
      });
      if (best) result += `\n🏆 **Best session:** ${best.name} (${formatCurrency(best.pnl)})\n`;
      if (worst && worst.pnl < 0) result += `📉 **Toughest session:** ${worst.name} (${formatCurrency(worst.pnl)})\n`;
      result += `\n💡 You trade best during **${best.name}** sessions. Consider scheduling your most important trades then.`;
      return { text: result, data: sessionData, intent };
    }

    case 'overall': {
      result = `Here's your overall trading performance:\n\n`;
      result += `📊 **Total Trades:** ${stats.totalTrades}\n`;
      result += `📈 **Total P&L:** ${formatCurrency(trades.reduce((s, t) => s + t.pnl, 0))}\n`;
      result += `✅ **Win Rate:** ${stats.winRate}%\n`;
      result += `⚡ **Profit Factor:** ${stats.profitFactor}\n`;
      result += `🎯 **Expectancy:** ${formatCurrency(parseFloat(stats.avgWin || 0) * (parseFloat(stats.winRate)/100) - parseFloat(stats.avgLoss || 0) * (1 - parseFloat(stats.winRate)/100))} per trade\n`;
      result += `💰 **Avg Win:** ${formatCurrency(parseFloat(stats.avgWin))} | **Avg Loss:** -${formatCurrency(parseFloat(stats.avgLoss))}\n`;
      result += `📅 **Monthly P&L:** ${formatCurrency(monthlyPnL)} (${progress.progress}% of target)\n\n`;
      result += `📋 **Consistency Score:** ${consistency.score}/100 — ${consistency.label}\n\n`;

      const advice = generateAdvice(trades, stats, streaks, consistency);
      if (advice.length > 0) result += `💡 **Tip:** ${advice[0]}`;
      return { text: result, data: stats, intent };
    }

    case 'win_rate': {
      const wins = trades.filter(t => t.pnl > 0).length;
      const losses = trades.filter(t => t.pnl < 0).length;
      const breakeven = trades.filter(t => t.pnl === 0).length;

      result = `Your **Win Rate** is **${stats.winRate}%**\n\n`;
      result += `✅ **Wins:** ${wins}\n`;
      result += `❌ **Losses:** ${losses}\n`;
      if (breakeven > 0) result += `➖ **Breakeven:** ${breakeven}\n`;
      result += `📊 **Total Trades:** ${stats.totalTrades}\n\n`;

      const wr = parseFloat(stats.winRate);
      if (wr >= 70) result += `🎯 Excellent win rate! You're consistently picking winners.`;
      else if (wr >= 50) result += `👍 Solid win rate. Focus on improving your average win vs average loss to boost profitability.`;
      else if (wr >= 35) result += `📉 Your win rate could use improvement. Try filtering for higher-quality setups.`;
      else result += `⚠️ Your win rate is below 35%. Consider paper trading or reducing position size until you identify what's working.`;
      return { text: result, data: { winRate: stats.winRate, wins, losses }, intent };
    }

    case 'streak': {
      if (streaks.currentStreak === 0 && streaks.longestWinStreak === 0) {
        return { text: "No streak data yet. Start adding trades and we'll track your streaks!", data: null };
      }
      result = `**Streak Analysis:**\n\n`;
      if (streaks.currentStreak > 0) {
        const emoji = streaks.currentStreakType === 'win' ? '🔥' : '❄️';
        const type = streaks.currentStreakType === 'win' ? 'winning' : 'losing';
        result += `${emoji} **Current Streak:** ${streaks.currentStreak} ${type} trade${streaks.currentStreak === 1 ? '' : 's'}\n`;
        if (streaks.currentStreakType === 'win' && streaks.currentStreak >= 3) result += `🔥 You're on fire! Keep riding this wave.\n`;
        if (streaks.currentStreakType === 'loss' && streaks.currentStreak >= 3) result += `⚠️ Consider taking a short break to reset.\n`;
      } else {
        result += `➖ **Current Streak:** No active streak\n`;
      }
      result += `🏆 **Longest Win Streak:** ${streaks.longestWinStreak}\n`;
      result += `📉 **Longest Loss Streak:** ${streaks.longestLossStreak}\n`;
      return { text: result, data: streaks, intent };
    }

    case 'monthly': {
      result = `**Monthly Target Progress:**\n\n`;
      result += `🎯 **Target:** ${formatCurrency(progress.target)}\n`;
      result += `💰 **Current:** ${formatCurrency(parseFloat(progress.current))}\n`;
      result += `📊 **Progress:** ${progress.progress}%\n\n`;

      if (progress.isTargetReached) {
        result += `🎉 **Congratulations! You've hit your monthly target!** 🎉\n\n`;
      }

      // Monthly trend
      const trend = getMonthlyTrend(trades);
      if (trend.length >= 2) {
        const recent = trend.slice(-3);
        result += `📈 **Recent months:**\n`;
        recent.forEach(m => {
          result += `  • ${m.month}: ${formatCurrency(m.pnl)}\n`;
        });
      }

      const dailyData = trades.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
      const tradingDays = [...new Set(dailyData.map(t => t.date))].length;
      const daysInMonth = new Date().getDate();
      result += `\n📅 **Trading days this month:** ${tradingDays} of ${daysInMonth}`;
      result += `\n💡 ${progress.progress < 50 ? 'You\'re less than halfway to your target. Consider increasing position size or frequency on high-probability setups.' : progress.progress < 100 ? 'More than halfway there! Stay disciplined and consistent.' : 'Target reached! Consider setting a stretch goal for the rest of the month.'}`;
      return { text: result, data: progress, intent };
    }

    case 'profit_factor': {
      if (stats.totalTrades === 0) return { text: 'No trades yet.', data: null };
      const pf = parseFloat(stats.profitFactor);
      result = `**Risk/Reward Analysis:**\n\n`;
      result += `⚡ **Profit Factor:** ${stats.profitFactor}\n`;
      result += `🎯 **Expectancy:** ${formatCurrency(parseFloat(stats.avgWin || 0) * (parseFloat(stats.winRate)/100) - parseFloat(stats.avgLoss || 0) * (1 - parseFloat(stats.winRate)/100))} per trade\n`;
      result += `💰 **Avg Win:** ${formatCurrency(parseFloat(stats.avgWin))}\n`;
      result += `📉 **Avg Loss:** -${formatCurrency(parseFloat(stats.avgLoss))}\n`;
      result += `📊 **Win/Loss Ratio:** ${stats.totalTrades > 0 ? (parseFloat(stats.avgWin) / Math.max(parseFloat(stats.avgLoss), 0.01)).toFixed(2) : 0}\n\n`;

      if (pf >= 2) result += `🌟 Excellent! A profit factor of ${pf} means you're making $${pf} for every $1 lost. Professional traders aim for 1.5+. Keep it up!`;
      else if (pf >= 1.5) result += `👍 Good profit factor of ${pf}. You're consistently profitable. Focus on increasing your average win to push it above 2.`;
      else if (pf >= 1) result += `📊 Your profit factor is ${pf} — barely profitable. Tighten your stops or let winners run longer.`;
      else result += `⚠️ Your profit factor is ${pf} — you're losing more than you make. Reduce size and focus on high-probability setups.`;
      return { text: result, data: { profitFactor: stats.profitFactor, expectancy: stats.expectancy }, intent };
    }

    case 'best_worst': {
      if (trades.length === 0) return { text: 'No trades yet.', data: null };
      const sortedByPnl = [...trades].sort((a, b) => b.pnl - a.pnl);
      const best = sortedByPnl[0];
      const worst = sortedByPnl[sortedByPnl.length - 1];

      result = `**Trade Records:**\n\n`;
      result += `🏆 **Best Trade:** ${formatCurrency(best.pnl)} (${best.sessionName}, ${best.date})\n`;
      if (best.setup) result += `   Setup: ${best.setup}\n`;
      if (best.emotion) result += `   Emotion: ${emotionLabelMap[best.emotion] || best.emotion}\n`;
      if (best.instrument) result += `   Instrument: ${best.instrument}\n`;

      result += `\n📉 **Worst Trade:** ${formatCurrency(worst.pnl)} (${worst.sessionName}, ${worst.date})\n`;
      if (worst.setup) result += `   Setup: ${worst.setup}\n`;
      if (worst.emotion) result += `   Emotion: ${emotionLabelMap[worst.emotion] || worst.emotion}\n`;
      if (worst.instrument) result += `   Instrument: ${worst.instrument}\n`;

      if (best.pnl > 0 && worst.pnl < 0) {
        const ratio = (best.pnl / Math.abs(worst.pnl)).toFixed(2);
        result += `\n📊 **Best/Worst Ratio:** ${ratio}x (your best trade is ${ratio}x the size of your worst loss)`;
      }
      return { text: result, data: { best, worst }, intent };
    }

    case 'advice': {
      const adviceList = generateAdvice(trades, stats, streaks, consistency);
      result = `**Personalized Trading Advice:**\n\n`;
      adviceList.forEach((tip, i) => {
        result += `${i + 1}. ${tip}\n\n`;
      });
      if (stats.totalTrades >= 10) {
        const dayData = getDayOfWeekData(trades).filter(d => d.count > 0).sort((a, b) => b.winRate - a.winRate);
        if (dayData.length > 0) result += `📊 Quick fact: Your highest win rate day is **${dayData[0].day}** (${dayData[0].winRate}%). Try focusing more trades on that day.`;
      } else {
        result += `📊 **Tip:** Once you have 10+ trades, I can give you more specific advice. Keep tracking!`;
      }
      return { text: result, data: null, intent };
    }

    case 'trend': {
      const trend = getMonthlyTrend(trades);
      if (trend.length < 2) return { text: "You don't have enough monthly data yet to analyze trends. Keep trading and checking in!", data: null };

      result = `**Performance Trend:**\n\n`;
      trend.forEach(m => {
        result += `• ${m.month}: ${formatCurrency(m.pnl)}\n`;
      });

      const pnls = trend.map(m => m.pnl);
      const first = pnls[0];
      const last = pnls[pnls.length - 1];
      const improving = last > first;
      const recent3 = pnls.slice(-3);
      const consistentUp = recent3.length === 3 && recent3[0] < recent3[1] && recent3[1] < recent3[2];
      const inconsistent = Math.max(...pnls) > 0 && Math.min(...pnls) < 0;

      result += `\n`;
      if (consistentUp) result += `📈 **Trend:** You're on an upward trajectory! Your last 3 months show consistent growth. Fantastic!`;
      else if (improving) result += `📈 **Trend:** Overall, you're improving. Month-over-month your P&L is trending upward.`;
      else if (inconsistent) result += `🔄 **Trend:** Your performance is inconsistent — some months up, some down. Focus on consistency.`;
      else result += `📊 **Trend:** Your performance has been relatively stable. Look for ways to push to the next level.`;

      const avgMonthly = pnls.reduce((s, v) => s + v, 0) / pnls.length;
      result += `\n📊 **Average Monthly P&L:** ${formatCurrency(avgMonthly)}`;
      return { text: result, data: trend, intent };
    }

    default: {
      // Fallback - give a helpful overview
      result = `Here's a quick snapshot of your trading:\n\n`;
      result += `📊 **Trades:** ${stats.totalTrades} | **Win Rate:** ${stats.winRate}%\n`;
      result += `💰 **Monthly P&L:** ${formatCurrency(monthlyPnL)} (${progress.progress}% of target)\n`;
      result += `⚡ **Profit Factor:** ${stats.profitFactor}\n\n`;
      result += `💡 Try asking me more specific questions like:\n`;
      result += `• "What's my best day of the week?"\n`;
      result += `• "How do I perform in the morning?"\n`;
      result += `• "What should I improve?"\n`;
      result += `• "How are my emotions affecting my trading?"\n`;
      result += `• "Am I on a streak?"`;
      return { text: result, data: null, intent: 'fallback' };
    }
  }
}
