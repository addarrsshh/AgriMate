import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';

export default function AiAssistantView() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! I am your AgriMate AI Agricultural Assistant. Ask me anything about crop diseases, balanced fertilizer schedules (organic or chemical), irrigation timing, or how to interpret mandi sell/hold signals.',
      mode: 'ready',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (questionToSend) => {
    const q = questionToSend || inputQuestion;
    if (!q || q.trim().length === 0 || loading) return;

    const userMessage = {
      role: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await api.askAssistant(q, {
        location: "Kozhikode, Kerala",
        season: "Rabi"
      });

      if (response.success && response.data) {
        const assistantMsg = {
          role: 'assistant',
          text: response.data.answer,
          mode: response.data.mode || 'assistant',
          notice: response.data.notice,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        text: 'I could not reach the backend AI service. Please verify that the Express server is running on port 5000.',
        mode: 'error',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "How do I control yellow rust in wheat?",
    "What is the best fertilizer schedule for basmati paddy?",
    "When is the best time to sell my mustard crop?",
    "What organic fertilizers can substitute chemical DAP?"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">AI Farming Assistant</h1>
      </div>

      {/* Main Chat Box Container */}
      <div className="glass-card rounded-2xl flex flex-col h-[600px] overflow-hidden border border-forest-100 shadow-lg">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                  isUser 
                    ? 'bg-forest-600' 
                    : 'bg-gradient-to-tr from-harvest-600 to-forest-600'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                  isUser
                    ? 'bg-forest-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.notice && (
                    <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                      ℹ️ {msg.notice}
                    </div>
                  )}

                  <div className={`text-[10px] text-right ${isUser ? 'text-forest-100' : 'text-slate-400'}`}>
                    {msg.time} {msg.mode && !isUser ? `• ${msg.mode}` : ''}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[75%]">
              <div className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-500 text-xs flex items-center gap-2 shadow-sm rounded-tl-none">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-forest-600" />
                <span>Formulating grounded agricultural guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-harvest-500" /> Suggested:
          </span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs hover:border-forest-400 hover:text-forest-800 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about fertilizer schedules, pest symptoms, or sell/hold decisions..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="p-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white transition-all shadow-md shadow-forest-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
