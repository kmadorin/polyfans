import type { Conversation } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

const useSendMessage = (conversation?: Conversation) => {
  const sendMessage = useCallback(
    async (message: string, params = null): Promise<boolean> => {
      console.log('params: ', params);
      if (!conversation) {
        return false;
      }
      try {
        await conversation.send(message, params);
      } catch (error) {
        return false;
      }
      return true;
    },
    [conversation]
  );

  return { sendMessage };
};

export default useSendMessage;
