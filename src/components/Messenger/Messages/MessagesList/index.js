import InfiniteScroll from 'react-infinite-scroll-component';
import {Typography} from 'antd';
const { Text } = Typography;
import clsx from 'clsx';
import styles from './MessagesList.module.scss';

function MissingXmtpAuth(){
  return (
    <div>
      <Text>{`This author hasn't enabled DMs yet`}</Text>
      <Text>{` You can't send them a message until they enable DMs.`}</Text>
     </div>
    )
};

function ConversationBeginningNotice() { 
  return (
    <Text>This is the beginning of the conversation</Text>
  )
};

function LoadingMore() {
  return (
    <div className="p-1 mt-6 text-center text-gray-300 font-bold text-sm">Loading...</div>
  ) 
};

function Message({ message, profile, currentUser }) {
  const address = currentUser?.ownedBy;

  return (
    <div className={clsx(styles.message, (address === message.senderAddress) && styles['message--my'])}>
      <div className={styles.message__block}>
        {message?.content}
      </div>
    </div>
  )
};

export default function MessagesList ({
  messages,
  fetchNextMessages,
  profile,
  currentUser,
  hasMore,
  missingXmtpAuth
}) {
  return (
      <div id="scrollableDiv" className={ styles['list__wrapper'] }>
        {missingXmtpAuth && <MissingXmtpAuth />}
        {messages && messages.length > 0 && <InfiniteScroll
          dataLength={messages.length}
          next={fetchNextMessages}
          className = {styles.list}
          inverse
          endMessage={<ConversationBeginningNotice />}
          hasMore={hasMore}
          loader={<LoadingMore />}
          scrollableTarget="scrollableDiv"
        >
          {messages.map(message => <Message className={styles.message} key={message.id} message={message} profile={profile} currentUser={currentUser}/>)}
        </InfiniteScroll> }
      </div>
  )
}