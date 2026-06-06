import React, { useContext, useState } from 'react';
import { TradingContext } from '../context/TradingContext';
import { Trash2, Plus, ChevronDown, ChevronUp, BookOpen, Edit3, Check, X } from 'lucide-react';

const SETUPS = ['Even/Odd', 'Over/Under', 'Touch/No Touch', 'Higher/Lower', 'Match/Diff', 'Asian', 'Digits', 'Other'];
const EMOTIONS = [
  { label: 'Calm 😌', value: 'calm' },
  { label: 'Confident 💪', value: 'confident' },
  { label: 'Anxious 😰', value: 'anxious' },
  { label: 'FOMO 😤', value: 'fomo' },
  { label: 'Revenge 😡', value: 'revenge' },
  { label: 'Disciplined 🎯', value: 'disciplined' },
];

const emotionColors = {
  calm: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  confident: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  fomo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  revenge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  disciplined: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

function SessionCard({ session, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    notes: session.notes || '',
    setup: session.setup || '',
    emotion: session.emotion || '',
    instrument: session.instrument || '',
  });

  const hasJournalData = session.notes || session.setup || session.emotion || session.instrument;

  const handleSave = () => {
    onUpdate(session.id, editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      notes: session.notes || '',
      setup: session.setup || '',
      emotion: session.emotion || '',
      instrument: session.instrument || '',
    });
    setEditing(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden">
      {/* Session Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-800 dark:text-white">{session.sessionName}</h3>
            {session.emotion && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${emotionColors[session.emotion] || 'bg-gray-100 text-gray-700'}`}>
                {EMOTIONS.find(e => e.value === session.emotion)?.label || session.emotion}
              </span>
            )}
            {session.setup && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium">
                {session.setup}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date(session.timestamp).toLocaleTimeString()}
            {session.instrument && <span className="ml-2 font-medium text-blue-500">{session.instrument}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${session.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {session.pnl >= 0 ? '+' : ''}${session.pnl.toFixed(2)}
          </span>
          <button
            onClick={() => { setExpanded(!expanded); if (!expanded) setEditing(false); }}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            title={hasJournalData ? 'View journal' : 'Add journal notes'}
          >
            {hasJournalData
              ? <BookOpen size={18} className="text-blue-500" />
              : expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />
            }
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Delete session"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Journal Panel */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-slate-600 p-4 bg-white dark:bg-slate-800">
          {!editing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Journal Entry</span>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Edit3 size={13} /> Edit
                </button>
              </div>
              {session.instrument && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Instrument</span>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{session.instrument}</p>
                </div>
              )}
              {session.setup && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Setup</span>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{session.setup}</p>
                </div>
              )}
              {session.emotion && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Emotional State</span>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {EMOTIONS.find(e => e.value === session.emotion)?.label || session.emotion}
                  </p>
                </div>
              )}
              {session.notes ? (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Notes</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{session.notes}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">No notes yet. Click Edit to add your thoughts.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Edit Journal</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Instrument</label>
                  <input
                    type="text"
                    placeholder="e.g. Vol 75, Vol 100, Boom 1000..."
                    value={editData.instrument}
                    onChange={e => setEditData({ ...editData, instrument: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Setup Type</label>
                  <select
                    value={editData.setup}
                    onChange={e => setEditData({ ...editData, setup: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">— Select —</option>
                    {SETUPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Emotion</label>
                  <select
                    value={editData.emotion}
                    onChange={e => setEditData({ ...editData, emotion: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">— Select —</option>
                    {EMOTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Notes</label>
                <textarea
                  placeholder="What happened? Why did you take this trade? What did you learn?"
                  value={editData.notes}
                  onChange={e => setEditData({ ...editData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X size={14} /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Check size={14} /> Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DailyTracker() {
  const { getTodaysSessions, addSession, deleteSession, updateSession } = useContext(TradingContext);
  const [sessionType, setSessionType] = useState('Morning');
  const [pnl, setPnl] = useState('');
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalData, setJournalData] = useState({ notes: '', setup: '', emotion: '', instrument: '' });

  const sessions = getTodaysSessions();
  const todaysTotal = sessions.reduce((sum, s) => sum + s.pnl, 0);

  const handleAddSession = (e) => {
    e.preventDefault();
    if (sessionType && pnl) {
      addSession(new Date().toISOString().split('T')[0], sessionType, pnl, journalData);
      setSessionType('Morning');
      setPnl('');
      setJournalData({ notes: '', setup: '', emotion: '', instrument: '' });
      setShowJournalForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Sessions</h2>

        {/* Add New Session Form */}
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-6">
          <form onSubmit={handleAddSession}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white font-semibold"
              >
                <option value="Morning">🌅 Morning Session</option>
                <option value="Afternoon">☀️ Afternoon Session</option>
                <option value="Evening">🌙 Evening Session</option>
              </select>
              <input
                type="number"
                placeholder="P&L Amount"
                step="0.01"
                value={pnl}
                onChange={(e) => setPnl(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowJournalForm(!showJournalForm)}
                  className={`flex-1 px-3 py-2 rounded-lg border flex items-center justify-center gap-1 text-sm transition-colors ${
                    showJournalForm
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                  }`}
                >
                  <BookOpen size={16} /> Journal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={20} /> Add
                </button>
              </div>
            </div>

            {/* Inline Journal Fields */}
            {showJournalForm && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600 space-y-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Journal Entry (optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Instrument</label>
                    <input
                      type="text"
                      placeholder="e.g. Vol 75, Vol 100, Boom 1000..."
                      value={journalData.instrument}
                      onChange={e => setJournalData({ ...journalData, instrument: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Setup Type</label>
                    <select
                      value={journalData.setup}
                      onChange={e => setJournalData({ ...journalData, setup: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">— Select —</option>
                      {SETUPS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Emotional State</label>
                    <select
                      value={journalData.emotion}
                      onChange={e => setJournalData({ ...journalData, emotion: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">— Select —</option>
                      {EMOTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Notes</label>
                  <textarea
                    placeholder="What happened? Why did you take this trade? What did you learn?"
                    value={journalData.notes}
                    onChange={e => setJournalData({ ...journalData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white resize-none"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Today's Summary */}
        <div className="bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-bold">Total Sessions Today:</span> {sessions.length} |
            <span className="font-bold ml-4">Today's Total:</span>
            <span className={`ml-2 font-bold ${todaysTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${todaysTotal.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={deleteSession}
                onUpdate={updateSession}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No sessions recorded today. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyTracker;