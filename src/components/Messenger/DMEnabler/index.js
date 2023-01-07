import styles from './DMEnabler.module.scss';
import { Typography, Button } from 'antd';
import { useContext, useState, useEffect, useCallback } from 'react';
import { Client } from '@xmtp/xmtp-js';
const {Text} = Typography;
import { useInitXMTPClient } from '../../../hooks/useXMTPClient';
import AppContext from '../../utils/AppContext';
import XMTP_ENV from '../../../constants';

export default function DMEnabler() {
	// const { currentUser } = useContext(AppContext);
	// const [canMessage, setCanMessage] = useState(false);
	// const [loading, setLoading] = useState(false);
	// const { initXmtpClient } = useInitXMTPClient();

	// const handleEnableDMs = useCallback(async () => {
	// 	try {
  //   	await initXmtpClient();
  //   	setCanMessage(await Client.canMessage(currentUser?.ownedBy, { env: XMTP_ENV }))
	// 	} catch (e) {
  //   	console.log('an error occured while connecting to xmtp client: \n', e);
	// 	}
  // }, [initXmtpClient])

	// useEffect(() => {
  //   const fetchCanMessage = async () => {
  //     setLoading(true);
  //     const isMessagesEnabled = await Client.canMessage(currentUser?.ownedBy, { env: XMTP_ENV });
  //     console.log('isMessagesEnabled: ', isMessagesEnabled);

  //     setCanMessage(isMessagesEnabled);
  //     setLoading(false);
  //   };
  //   fetchCanMessage();
  // }, [currentUser]);

	return (
		<div className={styles.enabler}>
			<Text className={styles['enabler__text']}>Activate your XMTP account to send end-to-end encrypted DMs</Text>
			<Button type="primary" onClick={ handleEnableDMs }>Enable DMs</Button>
		</div>
	)
}