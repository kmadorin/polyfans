import {Form, Input, Typography, Spin, Button} from 'antd';
import { useAccount } from 'wagmi';
import { useContext, useEffect, useState } from 'react';
import useChats from '../../../hooks/useChats';
import Chat from './Chat';
import styles from './ChatsList.module.scss';
import Link from 'next/link';
import AppContext from '../../utils/AppContext';
import buildConversationId from '../../../lib/buildConversationId';
import { buildConversationKey } from '../../../lib/conversationKey';

const { Text, Paragraph } = Typography;

function Loader({text='', size='large'}) {
	return (
		<div className={styles.loader}>
			<Spin tip={text} size={size}/>
		</div>
	)
}

function Login() {
	return (
		<div className={styles.login}>
				<div>
					<Paragraph style={{display: 'block'}}>Log in to start messaging</Paragraph>
					<Link href='/'><Button type="primary">Log in</Button></Link>
				</div>
		</div>
	)
} 

export default function ChatsList({ selectedConversationKey }) {
	const [mounted, setMounted] = useState(false);
	const {address: accountAddress} = useAccount();
	const { authenticating, loading, profileIds, chats, chatsProfiles } = useChats();
	const { currentUser } = useContext(AppContext);

	const sortedChatsProfiles = Array.from(chatsProfiles).sort(([keyA], [keyB]) => {
    const chatA = chats.get(keyA);
    const chatB = chats.get(keyB);
    return (chatA?.sent?.getTime() || 0) >= (chatB?.sent?.getTime() || 0) ? -1 : 1;
  });

  const showAuthenticating = currentUser && authenticating;
  const showLoading = loading && (chats.size === 0 || chatsProfiles.size === 0);

  useEffect(() => {
  	setMounted(true);
  }, []);

	return (
		<div className = {styles.list__wrapper}>
			<Form className={styles.searchForm}>
				<Form.Item
					name="search"
					style={{marginBottom: 0}}
				>
					<Input placeholder="Search"/>
				</Form.Item>
			</Form>
			<div className={ styles.list }>
				{!mounted || !accountAddress ? <Login />
					: (showAuthenticating ? <Loader text="Awaiting signature to enable chat" /> : 
					(showLoading ? <Loader text="Loading chats..." />
					: (sortedChatsProfiles?.map(([key, profile]) => {
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
					}))))}
			</div>
		</div>
	)
}