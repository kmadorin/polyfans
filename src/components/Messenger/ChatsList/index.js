import {Form, Input} from 'antd';
import { useContext } from 'react';
import useChats from '../../../hooks/useChats';
import Chat from './Chat';
import styles from './ChatsList.module.scss';
import AppContext from '../../utils/AppContext';
import buildConversationId from '../../../lib/buildConversationId';
import { buildConversationKey } from '../../../lib/conversationKey';

export default function ChatsList({ selectedConversationKey }) {
	const { authenticating, profileIds, chats, chatsProfiles } = useChats();
	const { currentUser } = useContext(AppContext);

	const sortedChatsProfiles = Array.from(chatsProfiles).sort(([keyA], [keyB]) => {
    const chatA = chats.get(keyA);
    const chatB = chats.get(keyB);
    return (chatA?.sent?.getTime() || 0) >= (chatB?.sent?.getTime() || 0) ? -1 : 1;
  });

	return (
		<div>
			<Form className={styles.searchForm}>
				<Form.Item
					name="search"
					style={{marginBottom: 0}}
				>
					<Input placeholder="Search"/>
				</Form.Item>
			</Form>
			<div className={ styles.list }>
				{sortedChatsProfiles?.map(([key, profile]) => {
					const chat = chats.get(key);

	        if (!chat) {
	          return null;
	        }

					return (
						<div className={ styles.list__item } key = {key}>
								<Chat 
									isSelected={key === selectedConversationKey}
		            	key={key}
		            	profile={profile}
		            	conversationKey={key}
		            	chat={chat} 
		          	/>
						</div>
	        )
				})}
			</div>
		</div>
	)
}