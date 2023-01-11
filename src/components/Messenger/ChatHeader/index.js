import { Space, Avatar, Typography } from 'antd';
const { Text } = Typography;
import getAvatar from '../../../lib/getAvatar';
import styles from './ChatHeader.module.scss';
import Unfollow from '../../Shared/Unfollow';
import {useMessengerStore} from '../../../store/messenger';

function ChatHeader({ profile }) {
	const toggleSidebar = useMessengerStore((state) => state.toggleSidebar);

	function handleProfileClick(e) {
		e.preventDefault();
		toggleSidebar();
	}

	return (
		<div className={styles.chatHeader}>
			<Space size={10} onClick={handleProfileClick} className={styles.chatHeader__profile}>
				<Avatar src={getAvatar(profile)} size={32} />
				<div>
					<Text className={styles.chatHeader__name}>{profile?.handle}</Text>
				</div>
			</Space>
			<div className={styles.chatHeader__buttons}>
				<Unfollow showText/>
			</div>
		</div>
	)
}

export default ChatHeader;