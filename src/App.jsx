import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import DailyTracker from "./components/DailyTracker";
import Charts from "./components/Charts";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";
import Header from "./components/Header";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-slate-700 flex-wrap">
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "sessions", label: "📝 Sessions" },
            { id: "charts", label: "📈 Charts" },
            { id: "statistics", label: "📉 Statistics" },
            { id: "settings", label: "⚙️ Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors text-sm md:text-base ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "sessions" && <DailyTracker />}
          {activeTab === "charts" && <Charts />}
          {activeTab === "statistics" && <Statistics />}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default App;
