import create from 'zustand';
import getUniqueMessages from '../lib/getUniqueMessages';

interface MessengerState {
  client: Client | undefined;
  setClient: (client: Client | undefined) => void;
  conversations: Map<string, Conversation>;
  setConversations: (conversations: Map<string, Conversation>) => void;
  addConversation: (key: string, newConversation: Conversation) => void;
  messages: Map<string, DecodedMessage[]>;
  setMessages: (messages: Map<string, DecodedMessage[]>) => void;
  addMessages: (key: string, newMessages: DecodedMessage[]) => number;
  selectedProfileId: string;
  setSelectedProfileId: (selectedProfileId: string) => void;
  chats: Map<string, DecodedMessage>;
  setChat: (key: string, message: DecodedMessage) => void;
  setChats: (chats: Map<string, DecodedMessage>) => void;
  chatsProfiles: Map<string, Profile>;
  setChatsProfiles: (chatsProfiles: Map<string, Profile>) => void;
  reset: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  ensName: string;
  setEnsName: (name: string) => void;
  ensAvatar: string;
  setEnsAvatar: (name: string) => void
}

export const useMessengerStore = create<MessengerState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  addConversation: (key: string, newConversation: Conversation) => {
    set((state) => {
      const conversations = new Map(state.conversations);
      conversations.set(key, newConversation);
      return { conversations };
    });
  },
  selectedProfileId: '',
  setSelectedProfileId: (selectedProfileId) => set(() => ({ selectedProfileId })),
  messages: new Map(),
  setMessages: (messages) => set(() => ({ messages })),
  addMessages: (key: string, newMessages: DecodedMessage[]) => {
    let numAdded = 0;
    set((state) => {
      const messages = new Map(state.messages);
      const existing = state.messages.get(key) || [];
      const updated = getUniqueMessages([...existing, ...newMessages]);
      numAdded = updated.length - existing.length;
      // If nothing has been added, return the old item to avoid unnecessary refresh
      if (!numAdded) {
        return { messages: state.messages };
      }
      messages.set(key, updated);
      return { messages };
    });
    return numAdded;
  },
  chats: new Map(),
  setChat: (key: string, message: DecodedMessage) =>
    set((state) => {
      const newChats = new Map(state.chats);
      newChats.set(key, message);
      return { chats: newChats };
    }),
  setChats: (chats) => set(() => ({ chats })),
  chatsProfiles: new Map(),
  setChatsProfiles: (chatsProfiles) => set(() => ({ chatsProfiles })),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({isSidebarOpen: !state.isSidebarOpen})),
  ensName: '',
  setEnsName: (ensName) => set(() => ({ ensName})),
  ensAvatar: '',
  setEnsAvatar: (ensAvatar) => set(() => ({ ensAvatar})),

  reset: () =>
    set((state) => {
      return {
        ...state,
        conversations: new Map(),
        messages: new Map(),
        chatsProfiles: new Map(),
        chats: new Map(),
      };
    })
}));