import AppContext from "../../utils/AppContext";
import { useContext, useState, useCallback } from 'react';
import { Row, Col} from 'antd'; 
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

function Chat({ conversationKey }) {
	const { currentUser } = useContext(AppContext);
	const profile = useMessengerStore((state) => state.chatsProfiles.get(conversationKey));
	const { selectedConversation, missingXmtpAuth } = useGetConversation(conversationKey, profile);
	const [endTime, setEndTime] = useState(new Map());
	const { messages, hasMore } = useGetMessages(
    conversationKey,
    selectedConversation,
    endTime.get(conversationKey)
  );

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
		<Row wrap={false}>
			<Col flex="300px" className={styles.sidebar}>
				< ChatsList />
			</Col>
			<Col flex="auto" className={ styles.content }>
				<ChatHeader profile={profile}/>
				{ showLoading ? 'loading...' : <MessagesList profile={profile} currentUser={currentUser} fetchNextMessages={fetchNextMessages} messages={ messages } hasMore={ hasMore }/> }
			  <NewMessage sendMessage={sendMessage} conversationKey={conversationKey} disabledInput={missingXmtpAuth ?? false}/>
      </Col>
		</Row>
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

export default MessagesPage;
