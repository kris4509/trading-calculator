import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import DailyTracker from "./components/DailyTracker";
import Charts from "./components/Charts";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";
import Journal from "./components/Journal";
import TradeCoach from "./components/TradeCoach";
import RiskCalculator from "./components/RiskCalculator";
import Header from "./components/Header";

const TABS = [
  { id: "dashboard",  label: "Dashboard",  icon: "📊" },
  { id: "coach",      label: "Coach",      icon: "🤖" },
  { id: "risk",       label: "Risk",       icon: "🛡️" },
  { id: "sessions",   label: "Sessions",   icon: "📝" },
  { id: "journal",    label: "Journal",    icon: "📖" },
  { id: "charts",     label: "Charts",     icon: "📈" },
  { id: "statistics", label: "Statistics", icon: "📉" },
  { id: "settings",   label: "Settings",   icon: "⚙️" },
];

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1528 50%, #0a1020 100%)',
    }}>
      {/* Background grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Ambient glow orbs */}
      <div className="fixed pointer-events-none" style={{
        top: '10%', left: '5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div className="fixed pointer-events-none" style={{
        top: '40%', right: '5%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      <Header />

      <div className="relative container mx-auto px-4 py-6 max-w-7xl">

        {/* Navigation Tabs */}
        <div className="relative flex gap-1 mb-6 overflow-x-auto pb-px" style={{
          borderBottom: '1px solid rgba(59,130,246,0.15)',
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  color: isActive ? '#60a5fa' : 'rgba(148,163,184,0.7)',
                  background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                  borderRadius: '8px 8px 0 0',
                  borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#cbd5e1'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <span style={{
                    position: 'absolute', top: '6px', right: '8px',
                    width: '5px', height: '5px',
                    background: '#3b82f6',
                    borderRadius: '50%',
                    boxShadow: '0 0 6px #3b82f6',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div
          key={activeTab}
          className="animate-card"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,28,50,0.95) 100%)',
            border: '1px solid rgba(59,130,246,0.12)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {activeTab === "dashboard"  && <Dashboard />}
          {activeTab === "coach"      && <TradeCoach />}
          {activeTab === "risk"       && <RiskCalculator />}
          {activeTab === "sessions"   && <DailyTracker />}
          {activeTab === "journal"    && <Journal />}
          {activeTab === "charts"     && <Charts />}
          {activeTab === "statistics" && <Statistics />}
          {activeTab === "settings"   && <Settings />}
        </div>

      </div>
    </div>
  );
}

export default App;