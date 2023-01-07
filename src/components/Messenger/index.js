import {Row, Col, Modal, Space, Empty} from 'antd';
import { useEffect } from 'react';
import { useMessengerStore } from '../../store/messenger';
import useXmtpClient from '../../hooks/useXmtpClient';
import ChatsList from './ChatsList';
import MessengerLayout from '../MessengerLayout';
import styles from './Messenger.module.scss';

function Messenger() {
	return (
		<>
			<Row>
				<Col flex="300px" className={styles.sidebar}>
					<div>
						<ChatsList />
					</div>	
				</Col>
				<Col flex="auto">
					<Empty description = {<span>No messages yet</span>}/>
				</Col>
			</Row>
		</>
	)
}

export default Messenger;
