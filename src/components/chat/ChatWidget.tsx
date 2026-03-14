import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const { isOpen, sessions, openChat, closeChat } = useChatStore();
  const { isAuthenticated, currentUser } = useAuthStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // Count unresolved sessions with unread messages (sessions that have messages from keeper/ai recently)
  const hasNewMessages = sessions.some((s) => {
    if (s.isResolved) return false;
    const lastMsg = s.messages[s.messages.length - 1];
    return lastMsg && lastMsg.sender !== 'user';
  });

  const handleToggle = () => {
    if (!isAuthenticated || !currentUser) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
      return;
    }
    if (isOpen) {
      closeChat();
    } else {
      openChat(currentUser.id, currentUser.name);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window — rendered above the button */}
      {isOpen && isAuthenticated && currentUser && <ChatWindow />}

      {/* Sign-in tooltip */}
      {showTooltip && (
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          Sign in to chat with us 👋
          <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-gray-800 rotate-45" />
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={handleToggle}
        className="relative w-14 h-14 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-saffron-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}

        {/* Notification dot */}
        {!isOpen && hasNewMessages && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
