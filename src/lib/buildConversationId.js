import { XMTP_PREFIX } from '../constants';

const buildConversationId = (profileA, profileB) => {
  const numberA = parseInt(profileA.substring(2), 16);
  const numberB = parseInt(profileB.substring(2), 16);
  return numberA < numberB
    ? `${XMTP_PREFIX}/${profileA}-${profileB}`
    : `${XMTP_PREFIX}/${profileB}-${profileA}`;
};

export default buildConversationId;
