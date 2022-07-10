import {Typography, Button} from 'antd';

const {Title} = Typography;

import styles from './postCard.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {CommentsIcon, LockIcon} from "../../Shared/Icons";
import truncate from '../../../lib/truncate';
import clsx from "clsx";
import {parsePostContent} from "../postUtils";

dayjs.extend(relativeTime);

export default function PostCard({post, setPostOpened}) {

	const {coverImgURL, title, content, followers_only} = parsePostContent(post);

	function onPostClick(e) {
		if (!followers_only) {
			setPostOpened(post);
		}
	}

	return (
		<div className={clsx(styles.wrapper, followers_only && styles.wrapperLocked)} onClick={onPostClick}>
			<article className={styles.post}>
				<div
					className={styles.cover}
					style={{backgroundImage: `${coverImgURL ? ('url(' + coverImgURL + ')') : 'none'}`}}
				>
					{followers_only ? (<div className={styles.lockIcon}>
						<LockIcon/>
					</div>) : ''}
				</div>
				<div className={styles.contentWrapper}>
					<div className={styles.content}>
						<Title level={3} className={styles.title}>{title}</Title>
						<Typography>
							<p className={styles.text}>{truncate(content)}</p>
						</Typography>
					</div>
					<div className={styles.footer}>
						<time
							dateTime={new Date(post?.createdAt)} className={styles.date}
						>{dayjs(new Date(post?.createdAt)).fromNow()}</time>
						<span className={styles.comments}>
						<CommentsIcon className={styles.commentsIcon}/>{post?.stats?.totalAmountOfComments}
					</span>
					</div>
					{followers_only && (<div className={styles.lockScreen}>
						<Button type="primary" >Follow to view</Button>
					</div>)}
				</div>
			</article>
		</div>
	)
}
