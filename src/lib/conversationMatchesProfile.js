import { XMTP_PREFIX } from '../constants';

const conversationMatchesProfile = (profileId) => new RegExp(`${XMTP_PREFIX}/.*${profileId}`);

export default conversationMatchesProfile;
