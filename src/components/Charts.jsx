import React, { useContext, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TradingContext } from '../context/TradingContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Calendar Heatmap ──────────────────────────────────────────────
function CalendarHeatmap() {
  const { trades } = useContext(TradingContext);
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Build daily P&L map for this month
  const dailyMap = {};
  trades.forEach(t => {
    if (!t.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) return;
    dailyMap[t.date] = (dailyMap[t.date] || 0) + t.pnl;
  });

  const values = Object.values(dailyMap);
  const maxAbs = values.length > 0 ? Math.max(...values.map(Math.abs)) : 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const getColor = (pnl) => {
    if (pnl === undefined) return null;
    const intensity = Math.min(Math.abs(pnl) / maxAbs, 1);
    if (pnl > 0) {
      const lightness = Math.round(85 - intensity * 45);
      return `hsl(142, 70%, ${lightness}%)`;
    } else {
      const lightness = Math.round(85 - intensity * 45);
      return `hsl(0, 70%, ${lightness}%)`;
    }
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const [hovered, setHovered] = useState(null);

  const tradingDays = Object.keys(dailyMap).length;
  const profitDays = values.filter(v => v > 0).length;
  const lossDays = values.filter(v => v < 0).length;
  const totalPnL = values.reduce((s, v) => s + v, 0);

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: null, key: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const pnl = dailyMap[dateStr];
    const isToday = dateStr === today.toISOString().split('T')[0];
    days.push({ day: d, dateStr, pnl, isToday, key: dateStr });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Calendar Heatmap</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold text-gray-700 dark:text-gray-200 w-36 text-center">{monthName}</span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Month summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Trading Days', value: tradingDays, color: 'text-blue-500' },
          { label: 'Profit Days', value: profitDays, color: 'text-green-500' },
          { label: 'Loss Days', value: lossDays, color: 'text-red-500' },
          { label: 'Month P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? 'text-green-500' : 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map(({ day, dateStr, pnl, isToday, key }) => {
            if (!day) return <div key={key} />;
            const bg = getColor(pnl);
            return (
              <div
                key={key}
                onMouseEnter={() => setHovered({ dateStr, pnl, day })}
                onMouseLeave={() => setHovered(null)}
                className={`relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-default transition-transform hover:scale-110 hover:z-10 ${
                  isToday ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-700' : ''
                } ${!bg ? 'bg-gray-200 dark:bg-slate-600' : ''}`}
                style={bg ? { backgroundColor: bg } : {}}
              >
                <span className={`text-xs font-semibold leading-none ${
                  pnl !== undefined
                    ? pnl >= 0 ? 'text-green-900' : 'text-red-900'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {day}
                </span>
                {pnl !== undefined && (
                  <span className={`text-[9px] leading-none mt-0.5 font-bold ${
                    pnl >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {pnl >= 0 ? '+' : ''}${Math.abs(pnl) >= 10 ? pnl.toFixed(0) : pnl.toFixed(1)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hover tooltip */}
        {hovered && hovered.pnl !== undefined && (
          <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">
              {new Date(hovered.dateStr + 'T12:00:00').toLocaleDateString(undefined, {
                weekday: 'long', month: 'short', day: 'numeric'
              })}
            </span>
            {' — '}
            <span className={`font-bold ${hovered.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {hovered.pnl >= 0 ? '+' : ''}${hovered.pnl.toFixed(2)}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-slate-600">
          <span className="text-xs text-gray-400">Less</span>
          {['hsl(142,70%,82%)', 'hsl(142,70%,65%)', 'hsl(142,70%,48%)', 'hsl(142,70%,40%)'].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
          ))}
          <span className="text-xs text-gray-400 mr-3">Profit</span>
          {['hsl(0,70%,82%)', 'hsl(0,70%,65%)', 'hsl(0,70%,48%)', 'hsl(0,70%,40%)'].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
          ))}
          <span className="text-xs text-gray-400">Loss</span>
          <span className="text-xs text-gray-400 ml-3">More</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Charts Component ─────────────────────────────────────────
function Charts() {
  const { getMonthlyData, getDailyData } = useContext(TradingContext);

  const monthlyData = getMonthlyData();
  const dailyData = getDailyData();

  return (
    <div className="space-y-8">

      {/* Calendar Heatmap */}
      <CalendarHeatmap />

      {/* Monthly Trend */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Monthly P&L Trend</h2>
        {monthlyData.length > 0 ? (
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pnl"
                  stroke="#3b82f6"
                  dot={{ fill: '#3b82f6' }}
                  strokeWidth={2}
                  name="Monthly P&L"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">No data available</div>
        )}
      </div>

      {/* Daily Bar Chart */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Daily P&L This Month</h2>
        {dailyData.length > 0 ? (
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={500}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="pnl" fill="#8b5cf6" name="Daily P&L" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">No data available</div>
        )}
      </div>
    </div>
  );
}

export default Charts;