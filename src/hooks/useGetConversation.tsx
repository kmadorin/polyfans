import { parseConversationKey } from '../lib/conversationKey';
import { Client } from '@xmtp/xmtp-js';
import { XMTP_ENV } from '../constants';
import { useEffect, useState, useContext } from 'react';
import { useMessengerStore } from '../store/messenger';
import AppContext from '../components/utils/AppContext';

const useGetConversation = (conversationKey: string, profile : any) => {
  const client = useMessengerStore((state) => state.client);
  const selectedConversation = useMessengerStore((state) => state.conversations.get(conversationKey));
  const addConversation = useMessengerStore((state) => state.addConversation);
  const { currentUser } = useContext(AppContext);
  const [missingXmtpAuth, setMissingXmtpAuth] = useState<boolean>();

  const reset = () => {
    setMissingXmtpAuth(false);
  };

  useEffect(() => {
    if (!profile || !client) {
      return;
    }
    if (selectedConversation) {
      setMissingXmtpAuth(false);
      return;
    }
    const createNewConversation = async () => {
      const conversationId = parseConversationKey(conversationKey)?.conversationId;
      const canMessage = await Client.canMessage(profile.ownedBy, { env: XMTP_ENV });
      setMissingXmtpAuth(!canMessage);

      if (!canMessage || !conversationId) {
        return;
      }
      const conversation = await client.conversations.newConversation(profile.ownedBy, {
        conversationId: conversationId,
        metadata: {}
      });
      addConversation(conversationKey, conversation);
    };
    createNewConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, selectedConversation]);

  useEffect(() => {
    if (!currentUser) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return {
    selectedConversation,
    missingXmtpAuth
  };
};

export default useGetConversation;
