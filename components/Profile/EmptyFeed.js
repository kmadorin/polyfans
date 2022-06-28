import {Row, Col, Typography, Button} from 'antd';
import Image from 'next/image';

const {Title} = Typography;
import styles from './emptyfeed.module.css';
import NewPost from '../Post/NewPost/NewPost';

export default function EmptyFeed() {
	return (
		<Row justify="center" align="middle" className={styles.feed}>
			<Col align="middle">
				<div>
					<Title level={3} className={styles.title}>Create your first post</Title>
					<NewPost className={styles.btn} />
				</div>
				<Image src='/images/empty_feed.png' width={412} height={340} alt="empty feed image"/>
			</Col>
		</Row>
	)
}
