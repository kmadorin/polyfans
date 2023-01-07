import styles from './Chat.module.scss';
import { Avatar, Typography } from 'antd';
import getAvatar from '../../../../lib/getAvatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);
const { Text } = Typography;


function Chat({ profile, chat, conversationKey, isSelected }) {
	const router = useRouter();
	
	const onChatSelected = (profileId) => () => {
    router.push(profileId ? `/messenger/${conversationKey}` : '/messenger');
  };

	return (
		<div className={ styles.chat } onClick={onChatSelected(profile.id)}> 
			<div className={styles.chat__left}>
				<Avatar size={32} src={getAvatar(profile)} alt={profile?.handle}/>
			</div>
			<div className = {styles.chat__right}>
				<div className={styles.chat__header}>
					<Text className = {styles.chat__name}>{profile?.name ?? profile.handle}</Text>
					{chat.sent && (
            <time dateTime={chat.sent} className = {styles.chat__time}>
              {dayjs(new Date(chat.sent)).fromNow()}
            </time>
          )}
				</div>
				<Text className={styles.chat__content}>{chat.content}</Text>
			</div>
		</div>
	)
}

export default Chat