import styles from './comment.module.scss';

import {Avatar, Typography} from "antd";
const {Title} = Typography;
import getAvatar from "../../../../lib/getAvatar";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

export default function Comment({comment, ...props}) {
	const author = comment?.profile;
	return (
		<div className={styles.comment}>
			<div className={styles.header}>
				<Avatar size={32} src={getAvatar(author)} alt={author?.handle} className={styles.avatar}/>
				<div className="details">
					<Title level={5} className={styles.name}>{author.name || author.handle}</Title>
					<time
						dateTime={new Date(comment?.createdAt)} className={styles.date}
					>{dayjs(new Date(comment?.createdAt)).format('MMMM D, hh:mm A')}</time>
				</div>
			</div>
			<div className={styles.content}>
				{comment?.metadata?.content}
			</div>
		</div>
	)
}
