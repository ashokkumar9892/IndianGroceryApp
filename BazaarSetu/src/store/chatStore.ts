import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatSession, ChatMessage } from '../types';
import { getAIResponse } from '../utils/chatAI';

interface ChatStore {
  sessions: ChatSession[];
  isOpen: boolean;
  activeSessionId: string | null;
  isTyping: boolean;
  openChat: (customerId: string, customerName: string, storeId?: string) => void;
  closeChat: () => void;
  sendMessage: (content: string, customerId: string, customerName: string) => void;
  keeperReply: (sessionId: string, keeperName: string, content: string) => void;
  getStoreSessions: (storeId: string) => ChatSession[];
  markResolved: (sessionId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      isOpen: false,
      activeSessionId: null,
      isTyping: false,

      openChat: (customerId, customerName, storeId) => {
        const { sessions } = get();
        // Find existing open session for this customer
        const existing = sessions.find(s => s.customerId === customerId && !s.isResolved);
        if (existing) {
          set({ isOpen: true, activeSessionId: existing.id });
        } else {
          const newSession: ChatSession = {
            id: `chat-${Date.now()}`,
            customerId,
            customerName,
            storeId,
            messages: [],
            isResolved: false,
            createdAt: new Date().toISOString(),
          };
          set({
            sessions: [newSession, ...sessions],
            isOpen: true,
            activeSessionId: newSession.id,
          });
        }
      },

      closeChat: () => set({ isOpen: false }),

      sendMessage: (content, customerId, customerName) => {
        const { sessions, activeSessionId } = get();
        let sessionId = activeSessionId;

        if (!sessionId) {
          const newSession: ChatSession = {
            id: `chat-${Date.now()}`,
            customerId,
            customerName,
            messages: [],
            isResolved: false,
            createdAt: new Date().toISOString(),
          };
          set({ sessions: [newSession, ...sessions], activeSessionId: newSession.id });
          sessionId = newSession.id;
        }

        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sessionId: sessionId!,
          sender: 'user',
          senderName: customerName,
          content,
          timestamp: new Date().toISOString(),
        };

        set({
          sessions: get().sessions.map(s =>
            s.id === sessionId ? { ...s, messages: [...s.messages, userMsg] } : s
          ),
          isTyping: true,
        });

        // Simulate AI response delay
        setTimeout(() => {
          const aiContent = getAIResponse(content);
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sessionId: sessionId!,
            sender: 'ai',
            senderName: 'BazaarSetu Assistant',
            content: aiContent,
            timestamp: new Date().toISOString(),
          };
          set({
            sessions: get().sessions.map(s =>
              s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
            ),
            isTyping: false,
          });
        }, 800);
      },

      keeperReply: (sessionId, keeperName, content) => {
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sessionId,
          sender: 'keeper',
          senderName: keeperName,
          content,
          timestamp: new Date().toISOString(),
        };
        set({
          sessions: get().sessions.map(s =>
            s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s
          ),
        });
      },

      getStoreSessions: (storeId) =>
        get().sessions.filter(s => s.storeId === storeId || !s.storeId),

      markResolved: (sessionId) => {
        set({
          sessions: get().sessions.map(s =>
            s.id === sessionId ? { ...s, isResolved: true } : s
          ),
        });
      },
    }),
    { name: 'bs_chat' }
  )
);
