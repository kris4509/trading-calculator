import React, { createContext, useState, useCallback, useEffect } from 'react';

export const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem('tradingData');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyTarget, setMonthlyTarget] = useState(() => {
    const saved = localStorage.getItem('monthlyTarget');
    return saved ? JSON.parse(saved) : 5000;
  });

  useEffect(() => {
    localStorage.setItem('tradingData', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('monthlyTarget', JSON.stringify(monthlyTarget));
  }, [monthlyTarget]);

  const addSession = useCallback((date, sessionName, pnl, journalData = {}) => {
    const newTrade = {
      id: Date.now(),
      date,
      sessionName,
      pnl: parseFloat(pnl),
      timestamp: new Date().toISOString(),
      // Journal fields
      notes: journalData.notes || '',
      setup: journalData.setup || '',
      emotion: journalData.emotion || '',
      instrument: journalData.instrument || '',
    };
    setTrades((prev) => [newTrade, ...prev]);
    return newTrade;
  }, []);

  const updateSession = useCallback((id, updates) => {
    setTrades((prev) =>
      prev.map((trade) => (trade.id === id ? { ...trade, ...updates } : trade))
    );
  }, []);

  const deleteSession = useCallback((id) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  }, []);

  const getTodaysSessions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return trades.filter((trade) => trade.date === today);
  }, [trades]);

  const getTodaysPnL = useCallback(() => {
    return getTodaysSessions().reduce((sum, trade) => sum + trade.pnl, 0);
  }, [getTodaysSessions]);

  const getMonthlyPnL = useCallback(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    return trades
      .filter((trade) => trade.date.startsWith(currentMonth))
      .reduce((sum, trade) => sum + trade.pnl, 0);
  }, [trades]);

  const getMonthlyData = useCallback(() => {
    const monthlyMap = {};
    trades.forEach((trade) => {
      const month = trade.date.slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = 0;
      monthlyMap[month] += trade.pnl;
    });
    return Object.entries(monthlyMap)
      .map(([month, pnl]) => ({ month, pnl }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [trades]);

  const getDailyData = useCallback(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const dailyMap = {};
    trades
      .filter((trade) => trade.date.startsWith(currentMonth))
      .forEach((trade) => {
        if (!dailyMap[trade.date]) dailyMap[trade.date] = 0;
        dailyMap[trade.date] += trade.pnl;
      });
    return Object.entries(dailyMap)
      .map(([date, pnl]) => ({ date, pnl }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [trades]);

  const getWinRate = useCallback(() => {
    if (trades.length === 0) return 0;
    const wins = trades.filter((trade) => trade.pnl > 0).length;
    return ((wins / trades.length) * 100).toFixed(2);
  }, [trades]);

  const getStats = useCallback(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0, winRate: 0, avgWin: 0, avgLoss: 0,
        largestWin: 0, largestLoss: 0, profitFactor: 0,
      };
    }
    const wins = trades.filter((t) => t.pnl > 0);
    const losses = trades.filter((t) => t.pnl < 0);
    const totalWins = wins.reduce((sum, t) => sum + t.pnl, 0);
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
    return {
      totalTrades: trades.length,
      winRate: ((wins.length / trades.length) * 100).toFixed(2),
      avgWin: wins.length > 0 ? (totalWins / wins.length).toFixed(2) : 0,
      avgLoss: losses.length > 0 ? (totalLosses / losses.length).toFixed(2) : 0,
      largestWin: wins.length > 0 ? Math.max(...wins.map((t) => t.pnl)).toFixed(2) : 0,
      largestLoss: losses.length > 0 ? Math.min(...losses.map((t) => t.pnl)).toFixed(2) : 0,
      profitFactor: totalLosses > 0 ? (totalWins / totalLosses).toFixed(2) : 0,
    };
  }, [trades]);

  const getMonthlyProgress = useCallback(() => {
    const monthlyPnL = getMonthlyPnL();
    const progress = ((monthlyPnL / monthlyTarget) * 100).toFixed(2);
    return {
      current: monthlyPnL.toFixed(2),
      target: monthlyTarget,
      progress: Math.min(progress, 100),
      isTargetReached: monthlyPnL >= monthlyTarget,
    };
  }, [getMonthlyPnL, monthlyTarget]);

  return (
    <TradingContext.Provider
      value={{
        trades,
        monthlyTarget,
        setMonthlyTarget,
        addSession,
        updateSession,
        deleteSession,
        getTodaysSessions,
        getTodaysPnL,
        getMonthlyPnL,
        getMonthlyData,
        getDailyData,
        getWinRate,
        getStats,
        getMonthlyProgress,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};