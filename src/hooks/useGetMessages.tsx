import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { MESSAGE_PAGE_LIMIT } from '../constants';
import { useEffect, useState } from 'react';
import { useMessengerStore } from '../store/messenger';

const useGetMessages = (conversationKey: string, conversation?: Conversation, endTime?: Date) => {
  const messages = useMessengerStore((state) => state.messages.get(conversationKey));
  const addMessages = useMessengerStore((state) => state.addMessages);
  const [hasMore, setHasMore] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!conversation) {
      return;
    }

    const loadMessages = async () => {
      const newMessages = await conversation.messages({
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
        limit: MESSAGE_PAGE_LIMIT,
        endTime: endTime
      });
      if (newMessages.length > 0) {
        addMessages(conversationKey, newMessages);
        if (newMessages.length < MESSAGE_PAGE_LIMIT) {
          hasMore.set(conversationKey, false);
          setHasMore(new Map(hasMore));
        } else {
          hasMore.set(conversationKey, true);
          setHasMore(new Map(hasMore));
        }
      } else {
        hasMore.set(conversationKey, false);
        setHasMore(new Map(hasMore));
      }
    };
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, conversationKey, endTime]);

  return {
    messages,
    hasMore: hasMore.get(conversationKey) ?? false
  };
};

export default useGetMessages;
