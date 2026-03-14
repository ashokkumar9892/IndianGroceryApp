import { useEffect, useRef, useState } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import ChatMessage from './ChatMessage';

export default function ChatWindow() {
  const { sessions, activeSessionId, isTyping, closeChat, sendMessage } = useChatStore();
  const { currentUser } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !currentUser) return;
    sendMessage(text, currentUser.id, currentUser.name);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ width: 350, height: 450 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-saffron-500 to-orange-500 text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <div>
            <p className="text-sm font-semibold leading-none">ApnaKirana Assistant</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-xs text-orange-100">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-4">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-sm font-medium text-gray-500">
              Welcome to ApnaKirana!
            </p>
            <p className="text-xs mt-1">
              Ask me anything about products, stores, or your orders.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 justify-start mb-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">
              🤖
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
              <div className="flex gap-1 items-center">
                <span
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 bg-white flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent bg-gray-50"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
