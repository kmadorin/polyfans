import InfiniteScroll from 'react-infinite-scroll-component';
import { Player } from '@livepeer/react';
import { parseCid } from 'livepeer/media';
import {Typography} from 'antd';
import { ContentTypeComposite } from '@xmtp/xmtp-js';
const { Text } = Typography;
import clsx from 'clsx';
import styles from './MessagesList.module.scss';
import {IPFS_GATEWAY} from '../../../../constants';

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
  let messageContent = null;

  if (message.contentType.typeId === ContentTypeComposite.typeId) {
    const url = message.content.parts[1].content;
    const idParsed = parseCid(url);
    const messageText = message.content.parts[0].content;
    if (url && idParsed) {
      messageContent = (
        <>
          {messageText && <Text className={styles.message__text}>{messageText}</Text>}
          <Player
            title={idParsed.id}
            src={url}
            muted
          />
        </>
      )
    } else {
      messageContent = message.content.parts[0].content;    
    }

  } else {
    messageContent = message.content
  }

  return (
    <div className={clsx(styles.message, (address === message.senderAddress) && styles['message--my'])}>
      <div className={styles.message__block}>
        {messageContent}
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