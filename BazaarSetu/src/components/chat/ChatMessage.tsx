import type { ChatMessage as ChatMessageType } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { Store } from 'lucide-react';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isKeeper = message.sender === 'keeper';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {/* Avatar / icon for AI or Keeper */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2 mt-1">
          {isAI && (
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              🤖
            </div>
          )}
          {isKeeper && (
            <div className="w-7 h-7 rounded-full bg-leaf-100 flex items-center justify-center">
              <Store size={14} className="text-leaf-700" />
            </div>
          )}
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender label */}
        <span className="text-xs text-gray-500 mb-0.5 px-1">
          {isUser && message.senderName}
          {isAI && 'ApnaKirana AI'}
          {isKeeper && `Store: ${message.senderName}`}
        </span>

        {/* Bubble */}
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-saffron-500 text-white rounded-tr-sm'
              : isAI
              ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
              : 'bg-green-50 text-gray-800 border border-green-100 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 mt-0.5 px-1">
          {formatDateTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
