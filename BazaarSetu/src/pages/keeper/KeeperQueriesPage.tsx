import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, MessageSquare, User, Clock } from 'lucide-react';
import KeeperLayout from '../../components/keeper/KeeperLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { formatDateTime } from '../../utils/formatters';
import type { ChatSession, ChatMessage } from '../../types';

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.sender === 'user';
  const isKeeper = msg.sender === 'keeper';
  const isAI = msg.sender === 'ai';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
          {isAI ? (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">🤖</div>
          ) : (
            <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
              <User size={13} className="text-green-700" />
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-gray-400 mb-0.5 px-1">
          {isUser && msg.senderName}
          {isAI && 'BazaarSetu AI'}
          {isKeeper && `Store: ${msg.senderName}`}
        </span>
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-saffron-500 text-white rounded-tr-sm'
              : isAI
              ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
              : 'bg-green-50 text-gray-800 border border-green-100 rounded-tl-sm'
          }`}
        >
          {msg.content}
        </div>
        <span className="text-xs text-gray-400 mt-0.5 px-1">{formatDateTime(msg.timestamp)}</span>
      </div>
    </div>
  );
}

function SessionListItem({
  session,
  isSelected,
  onClick,
}: {
  session: ChatSession;
  isSelected: boolean;
  onClick: () => void;
}) {
  const lastMsg = session.messages[session.messages.length - 1];
  const hasUnresolved = !session.isResolved && session.messages.length > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors ${
        isSelected ? 'bg-saffron-50 border-l-2 border-l-saffron-500' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-saffron-700">
            {session.customerName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{session.customerName}</p>
            {lastMsg && (
              <p className="text-xs text-gray-500 truncate max-w-[160px]">
                {lastMsg.sender === 'user' ? '' : lastMsg.sender === 'ai' ? '🤖 ' : '🏪 '}
                {lastMsg.content}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {lastMsg && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {new Date(lastMsg.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          {hasUnresolved && !session.isResolved && (
            <span className="w-2 h-2 bg-saffron-500 rounded-full" />
          )}
          {session.isResolved && (
            <CheckCircle size={12} className="text-green-500" />
          )}
        </div>
      </div>
    </button>
  );
}

export default function KeeperQueriesPage() {
  const { currentUser } = useAuthStore();
  const { sessions, keeperReply, markResolved } = useChatStore();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storeId = currentUser?.assignedStoreId ?? '';

  // Show sessions related to this store or general sessions
  const storeSessions = sessions.filter(
    (s) => !s.storeId || s.storeId === storeId
  );

  const selectedSession = storeSessions.find((s) => s.id === selectedSessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages]);

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text || !selectedSessionId || !currentUser) return;
    keeperReply(selectedSessionId, currentUser.name, text);
    setReplyText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleMarkResolved = () => {
    if (!selectedSessionId) return;
    markResolved(selectedSessionId);
  };

  const unresolvedCount = storeSessions.filter((s) => !s.isResolved && s.messages.length > 0).length;

  return (
    <ProtectedRoute role="storekeeper">
      <KeeperLayout>
        <div className="flex h-[calc(100vh-64px)] lg:h-screen overflow-hidden">
          {/* Sessions list */}
          <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={18} className="text-saffron-500" />
                <h2 className="text-base font-bold text-gray-900">Customer Queries</h2>
              </div>
              {unresolvedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-saffron-50 text-saffron-700 border border-saffron-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full" />
                  {unresolvedCount} unresolved
                </span>
              )}
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto">
              {storeSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                  <MessageSquare size={32} className="mb-2 text-gray-300" />
                  <p className="text-sm">No customer sessions yet.</p>
                </div>
              ) : (
                storeSessions.map((session) => (
                  <SessionListItem
                    key={session.id}
                    session={session}
                    isSelected={selectedSessionId === session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
            {!selectedSession ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-8">
                <MessageSquare size={48} className="mb-4 text-gray-200" />
                <p className="text-base font-medium text-gray-500">Select a conversation</p>
                <p className="text-sm mt-1">Choose a customer session from the left panel to view and reply.</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-saffron-100 flex items-center justify-center text-sm font-bold text-saffron-700">
                      {selectedSession.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedSession.customerName}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-gray-400" />
                        <span className="text-xs text-gray-400">
                          Started {formatDateTime(selectedSession.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSession.isResolved ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
                        <CheckCircle size={13} />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={handleMarkResolved}
                        className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full font-medium transition-colors"
                      >
                        <CheckCircle size={13} />
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {selectedSession.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                      <p>No messages yet in this session.</p>
                    </div>
                  ) : (
                    selectedSession.messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply input */}
                {!selectedSession.isResolved ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Reply as ${currentUser?.name ?? 'Keeper'}...`}
                      className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-400 bg-gray-50"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="w-10 h-10 rounded-xl bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label="Send reply"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-green-50 border-t border-green-100 text-center">
                    <p className="text-xs text-green-600 font-medium">
                      This session has been marked as resolved.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </KeeperLayout>
    </ProtectedRoute>
  );
}
