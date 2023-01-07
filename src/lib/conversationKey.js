import { XMTP_PREFIX } from '../constants';

const CONVERSATION_KEY_RE = /^(.*)\/lens\.dev\/dm\/(.*)-(.*)$/;

export const buildConversationKey = (peerAddress, conversationId) =>
  `${peerAddress.toLowerCase()}/${conversationId}`;

export const parseConversationKey = (conversationKey) => {
  const matches = conversationKey.match(CONVERSATION_KEY_RE);
  if (!matches || matches.length !== 4) {
    return null;
  }

  const [, peerAddress, memberA, memberB] = Array.from(matches);

  return {
    peerAddress,
    members: [memberA, memberB],
    conversationId: `${XMTP_PREFIX}/${memberA}-${memberB}`
  };
};
