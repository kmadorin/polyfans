import {Row, Col, Typography, Button} from 'antd';
import Image from 'next/image';

const {Title} = Typography;
import styles from './emptyfeed.module.css';
import NewPost from '../../Post/NewPost';
import {useRouter} from "next/router";

export default function EmptyFeed({currentUser}) {
	const {
		query: { username }
	} = useRouter()

	const isOwner = currentUser?.handle === username;
	const text = isOwner ? 'Create your first post' : 'No posts yet'

	return (
		<Row justify="center" align="middle" className={styles.feed}>
			<Col align="middle">
				<div>
					<Title level={3} className={styles.title}>{text}</Title>
					{isOwner && <NewPost className={styles.btn} />}
				</div>
				<Image src='/images/empty_feed.png' width={412} height={340} alt="empty feed image"/>
			</Col>
		</Row>
	)
}
