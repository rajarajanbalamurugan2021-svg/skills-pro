import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Compass,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AIMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${currentUser.name.split(' ')[0]}! I'm your SkillsPro AI Placement & Technical Career Mentor powered by Gemini.

How can I help you today? You can ask me to:
• Break down complex DSA algorithms or DP patterns
• Guide you through a System Design interview scenario
• Review and polish your STAR behavioral interview answers
• Formulate a tailored 30-day technical placement roadmap`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I master Dynamic Programming for FAANG?',
    'Give me a STAR example for a technical disagreement',
    'How to design a URL Shortener like Bitly?',
    'Tips to clear the first Aptitude screening round',
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await api.askAIMentor(textToSend, {
        userName: currentUser.name,
        targetRole: currentUser.targetRole,
        streakDays: currentUser.streakDays,
        skills: currentUser.skills,
        points: currentUser.points,
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: 'Apologies, I encountered a temporary connection glitch. Please ask again or select one of the suggested prompts!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">SkillsPro AI Mentor</h2>
                <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                24/7 AI Technical & Placement Counselor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'm_reset',
                    sender: 'ai',
                    text: 'Conversation reset. What technical concept or placement challenge shall we tackle next?',
                    timestamp: 'Just now',
                  },
                ])
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>Topics:</span>
          </div>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-950/60 hover:border-indigo-500/40 border border-slate-700/60 text-slate-300 hover:text-indigo-300 text-[11px] whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 rounded-tr-sm'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                      title="Copy advice"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">AI Mentor formulating response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Explain Floyd cycle detection with code')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            AI advice tailored for tech placement rounds & coding interviews.
          </p>
        </div>
      </div>
    </div>
  );
};
