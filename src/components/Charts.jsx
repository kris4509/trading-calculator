import React, { useContext } from 'react';
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

function Charts() {
  const { getMonthlyData, getDailyData } = useContext(TradingContext);

  const monthlyData = getMonthlyData();
  const dailyData = getDailyData();

  return (
    <div className="space-y-8">
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>

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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default Charts;
