import AppContext from "../../utils/AppContext";
import { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Row, Col} from 'antd'; 
import { useEnsName, useEnsAddress, useEnsAvatar } from 'wagmi';
import Page404 from '../../../pages/404';
import { useRouter } from 'next/router';
import { parseConversationKey } from '../../../lib//conversationKey';
import { useMessengerStore } from '../../../store/messenger';
import useGetConversation from '../../../hooks/useGetConversation';
import useGetMessages from '../../../hooks/useGetMessages';
import useSendMessage from '../../../hooks/useSendMessage';
import useStreamMessages from '../../../hooks/useStreamMessages';
import ChatsList from '../ChatsList';
import MessagesList from './MessagesList';
import styles from './Messages.module.scss';
import ChatHeader from '../ChatHeader/';
import NewMessage from './NewMessage';
import MessengerLayout from '../../MessengerLayout'

function Chat({ conversationKey }) {
	const { currentUser } = useContext(AppContext);
	const profile = useMessengerStore((state) => state.chatsProfiles.get(conversationKey));
  const setEnsName = useMessengerStore((state) => state.setEnsName);
  const setEnsAvatar = useMessengerStore((state) => state.setEnsAvatar);
  const ensName = useMemo(() => 'Yoginth.eth', []);
  // TODO: check why ensName is not resolved
  // const ensName = useEnsName({ address: profile?.ownedBy, chainId: 1});
  const {data: ensAvatar} = useEnsAvatar({ address: profile?.ownedBy, chainId: 1});

	const { selectedConversation, missingXmtpAuth } = useGetConversation(conversationKey, profile);
	const [endTime, setEndTime] = useState(new Map());
	const { messages, hasMore } = useGetMessages(
    conversationKey,
    selectedConversation,
    endTime.get(conversationKey)
  );

  useEffect(() => {
    setEnsName(ensName)
    setEnsAvatar(ensAvatar)
  }, [ensName, ensAvatar])

  useStreamMessages(conversationKey, selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);

	const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent;
      const currentEndTime = endTime.get(conversationKey);
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationKey, lastMsgDate);
        setEndTime(new Map(endTime));
      }
    }
  }, [conversationKey, hasMore, messages, endTime]);

  if (!currentUser) {
    return <Page404 />;
  }

  const showLoading = !missingXmtpAuth && (!profile || !currentUser || !selectedConversation);

	return (
			<div className={ styles.content }>
				<ChatHeader profile={profile} className={styles.header}/>
        <div className={styles.messages}>
				  { showLoading ? 'loading...' : <MessagesList profile={profile} currentUser={currentUser} fetchNextMessages={fetchNextMessages} messages={ messages } hasMore={ hasMore }/> }
			  </div>
        <NewMessage sendMessage={sendMessage} className={styles.newMessage} conversationKey={conversationKey} disabledInput={missingXmtpAuth ?? false}/>
      </div>
	)
}

function MessagesPage() {
	const { currentUser } = useContext(AppContext);
	const currentProfileId = currentUser?.id;

	const {
    query: { conversationKey }
  } = useRouter();

  if (!conversationKey || !currentProfileId || !Array.isArray(conversationKey)) {
    return <Page404 />;
  }

  const joinedConversationKey = conversationKey.join('/');
  const parsed = parseConversationKey(joinedConversationKey);

  if (!parsed) {
    return <Page404 />;
  }

  const { members } = parsed;
  const profileId = members.find((member) => member !== currentProfileId);

  if (!profileId) {
    return <Page404 />;
  }

  return <Chat conversationKey={joinedConversationKey} />;
}

MessagesPage.getLayout = function getLayout(page) {
  return (
    <MessengerLayout>
      {page}
    </MessengerLayout>
  )
}

export default MessagesPage;
