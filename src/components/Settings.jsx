import React, { useContext, useState } from 'react';
import { TradingContext } from '../context/TradingContext';
import { Save, Download, Trash2, Target, Database, Info, CheckCircle } from 'lucide-react';

function Section({ icon: Icon, title, subtitle, children, accentColor = '#3b82f6' }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,30,55,0.8) 100%)',
      border: '1px solid rgba(59,130,246,0.12)',
    }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
          <Icon size={18} style={{ color: accentColor }} />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Settings() {
  const { monthlyTarget, setMonthlyTarget, trades } = useContext(TradingContext);
  const [newTarget, setNewTarget] = useState(monthlyTarget);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setMonthlyTarget(parseFloat(newTarget));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleClear = () => {
    if (window.confirm('⚠️ This will permanently delete all your trading data. This cannot be undone. Are you sure?')) {
      localStorage.removeItem('tradingData');
      window.location.reload();
    }
  };

  const totalPnL = trades.reduce((s, t) => s + t.pnl, 0);
  const journalled = trades.filter(t => t.notes || t.emotion || t.setup).length;

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)' }} />
        <div>
          <h2 className="text-2xl font-black text-white">Settings</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>Configure your trading tracker</p>
        </div>
      </div>

      {/* Monthly Target */}
      <Section icon={Target} title="Monthly Profit Target" subtitle="Set your monthly profit goal to track progress" accentColor="#3b82f6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(148,163,184,0.6)' }}>
              TARGET AMOUNT (USD)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'rgba(148,163,184,0.5)' }}>$</span>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  step="100"
                  className="w-full pl-8 pr-4 py-3 rounded-lg text-white font-semibold focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    fontSize: '15px',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'}
                />
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: saved ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
                  border: `1px solid ${saved ? 'rgba(34,197,94,0.4)' : 'rgba(59,130,246,0.4)'}`,
                  color: saved ? '#4ade80' : '#60a5fa',
                }}
              >
                {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                {saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs mb-2" style={{ color: 'rgba(148,163,184,0.4)' }}>Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {[100, 250, 500, 1000, 2500, 5000].map(preset => (
                <button
                  key={preset}
                  onClick={() => setNewTarget(preset)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: newTarget == preset ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${newTarget == preset ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: newTarget == preset ? '#60a5fa' : 'rgba(148,163,184,0.6)',
                  }}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Data Management */}
      <Section icon={Database} title="Data Management" subtitle="Export, backup, or clear your trading records" accentColor="#8b5cf6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Trades', value: trades.length, color: '#60a5fa' },
            { label: 'Journalled', value: journalled, color: '#a78bfa' },
            { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? '#4ade80' : '#f87171' },
          ].map(s => (
            <div key={s.label} className="rounded-lg p-3 text-center" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.08)'}
          >
            <Download size={18} />
            <div>
              <p>Export as JSON</p>
              <p className="text-xs font-normal mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Download all {trades.length} trade records as a backup file
              </p>
            </div>
          </button>

          <button
            onClick={handleClear}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
          >
            <Trash2 size={18} />
            <div>
              <p>Clear All Data</p>
              <p className="text-xs font-normal mt-0.5" style={{ color: 'rgba(148,163,184,0.4)' }}>
                Permanently delete all trades — cannot be undone
              </p>
            </div>
          </button>
        </div>
      </Section>

      {/* About */}
      <Section icon={Info} title="About" subtitle="Trading P&L Tracker" accentColor="#06b6d4">
        <div className="space-y-3">
          {[
            { label: 'Version', value: '2.0.0', color: 'text-white' },
            { label: 'Storage', value: 'Local Browser', color: 'text-white' },
            { label: 'Data Privacy', value: '100% Private', color: 'text-green-400' },
            { label: 'Built with', value: 'React + Tailwind', color: 'text-white' },
          ].map(({ label, value, color }, i, arr) => (
            <div key={label} className="flex items-center justify-between py-2" style={{
              borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span className="text-sm" style={{ color: 'rgba(148,163,184,0.6)' }}>{label}</span>
              <span className={`text-sm font-semibold ${color}`}>{value}</span>
            </div>
          ))}
          <p className="text-xs pt-2" style={{ color: 'rgba(148,163,184,0.4)', lineHeight: 1.7 }}>
            All data is stored locally in your browser. Nothing is sent to any server. Export your data regularly as a backup.
          </p>
        </div>
      </Section>

    </div>
  );
}

export default Settings;