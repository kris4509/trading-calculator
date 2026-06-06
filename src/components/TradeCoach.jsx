import { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { TradingContext } from '../context/TradingContext';
import { analyzeQuestion } from '../services/TradeCoach';
import { Send, Bot, Sparkles, TrendingUp, Award, Target, Zap, Activity } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'How am I doing?', icon: Activity },
  { label: 'Best day of week?', icon: TrendingUp },
  { label: 'What should I improve?', icon: Award },
  { label: 'Monthly target?', icon: Target },
  { label: 'Best setup?', icon: Zap },
  { label: 'Am I on a streak?', icon: TrendingUp },
];

function formatMessage(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold **text**
    let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (formatted.trim() === '') return <br key={i} />;
    return (
      <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.92)' }}
        dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
}

function TradeCoach() {
  const context = useContext(TradingContext);
  const { trades } = context;

  const [messages, setMessages] = useState(() => [{
    role: 'bot',
    text: `👋 **Hey there! I'm your Trade Coach.**\n\nI can analyze your trading data and answer questions like:\n• "What's my best day of the week?"\n• "How do emotions affect my trading?"\n• "What should I improve?"\n\nTry one of the suggestions below or type your own question!`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  const handleSend = useCallback(async (question) => {
    const q = (question || input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

    const contextFns = {
      getStats: context.getStats,
      getMonthlyProgress: context.getMonthlyProgress,
      getStreaks: context.getStreaks,
      getMonthlyPnL: context.getMonthlyPnL,
      getWinRate: context.getWinRate,
    };
    const result = analyzeQuestion(q, context.trades, contextFns);
    setMessages(prev => [...prev, { role: 'bot', text: result.text, intent: result.intent }]);
    setLoading(false);
  }, [input, loading, context]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (label) => {
    handleSend(label);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '480px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Trade Coach
            <Sparkles size={16} className="text-yellow-400" />
          </h2>
          <p className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>
            Analyzing {trades.length} trade{trades.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'rounded-bl-md'
            }`}
              style={msg.role === 'bot' ? {
                background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(20,30,55,0.95) 100%)',
                border: '1px solid rgba(59,130,246,0.15)',
              } : {}}>
              {msg.role === 'bot' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.7)' }}>Trade Coach</span>
                </div>
              )}
              <div className="space-y-0.5">{formatMessage(msg.text)}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(20,30,55,0.95) 100%)',
              border: '1px solid rgba(59,130,246,0.15)',
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Bot size={12} className="text-white" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.7)' }}>Trade Coach</span>
              </div>
              <div className="flex gap-1 py-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && trades.length > 0 && (
        <div className="flex flex-wrap gap-2 my-3">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: 'rgba(148,163,184,0.9)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.color = '#60a5fa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = 'rgba(148,163,184,0.9)'; }}
            >
              <action.icon size={12} />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={trades.length === 0 ? "Add some trades first, then ask me anything..." : "Ask me about your trading..."}
          disabled={loading || trades.length === 0}
          className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading || trades.length === 0}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: input.trim() ? 'rgba(59,130,246,0.25)' : 'transparent',
            color: input.trim() ? '#60a5fa' : 'rgba(148,163,184,0.4)',
          }}
        >
          <Send size={18} />
        </button>
      </div>
      {trades.length === 0 && (
        <p className="text-xs mt-1.5" style={{ color: 'rgba(148,163,184,0.4)' }}>
          Go to the Sessions tab to record your first trade.
        </p>
      )}
    </div>
  );
}

export default TradeCoach;
