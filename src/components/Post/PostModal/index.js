import {parsePostContent} from "../postUtils";
import {Avatar, Modal, Typography} from "antd";

const {Title} = Typography;
import styles from "./postModal.module.scss";
import Link from 'next/link'
import getAvatar from "../../../lib/getAvatar";
import Comments from '../Comments';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);


export default function PostModal({post = null, isPostModalVisible, setIsPostModalVisible}) {

	const {coverImgURL, title, content, followers_only} = parsePostContent(post);
	const author = post?.profile;

	function closePost() {
		setIsPostModalVisible(false);
	}

	return (
		post ? (
			<Modal
				className={styles.postsModal} visible={isPostModalVisible} onCancel={closePost} footer={null}
				closable={false}
				bodyStyle={{ padding: '0' }}
			>
				<article>
					<aside className={styles.top}>
						<Link
							rel='author' href={`/u/${author.handle}`}
						>
							<div className={styles.author}>
								<Avatar size={32} src={getAvatar(author)} alt={author?.handle}/>
								<div className={styles.details}>
									<Title level={4} className={styles.name}>{author.name}</Title>
									<span className={styles.handle}>@{author.handle}</span>
								</div>
							</div>
						</Link>
					</aside>
					<header className={styles.header}>
						<Title level={2} className={styles.title}>{title}</Title>
						<time
							dateTime={new Date(post?.createdAt)} className={styles.date}
						>{dayjs(new Date(post?.createdAt)).format('MMMM D, YYYY')}</time>
					</header>
					<section className={styles.contentWrapper}>
						<div className={styles.imageWrapper}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={coverImgURL} alt="post cover" className={styles.image}/>
						</div>
						<div className={styles.content}>
							{content}
						</div>
					</section>
					<Comments post={post} />
				</article>
			</Modal>) : null
	)
}
