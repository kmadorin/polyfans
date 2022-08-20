import {Typography, Button} from 'antd';

const {Title} = Typography;

import styles from './postCard.module.scss';
import dayjs from 'dayjs';
import {useEffect, useState, useContext} from "react";
import relativeTime from 'dayjs/plugin/relativeTime';
import {CommentsIcon, LockIcon} from "../../Shared/Icons";
import truncate from '../../../lib/truncate';
import clsx from "clsx";
import {parsePostContent, decryptContent} from "../postUtils";
import LitContext from "../../utils/LitContext";

dayjs.extend(relativeTime);

export default function PostCard({post, following, setPostOpened}) {
	const litClient = useContext(LitContext);
	const [decryptedContent, setDecryptedContent] = useState('');
	const {coverImgURL, title, content, followers_only, encryptedContent} = parsePostContent(post);
	console.log(`###: post`, post);
	const isHidden = (followers_only !=='false') && !following;

	useEffect(() => {
		if ((followers_only ==='true') && following) {
			const authSig = JSON.parse(localStorage.getItem('signature'));
			decryptContent(encryptedContent, litClient,authSig).then(res => {
				setDecryptedContent(res);
			})
		}
	})

	function onPostClick(e) {
		if ((followers_only === 'false') || following) {
			setPostOpened({...post, metadata: {...post.metadata, content: decryptedContent}});
		}
	}

	return (
		<div className={clsx(styles.wrapper, isHidden && styles.wrapperLocked)} onClick={onPostClick}>
			<article className={styles.post}>
				<div
					className={styles.cover}
					style={{backgroundImage: `${coverImgURL ? ('url(' + coverImgURL + ')') : 'none'}`}}
				>
					{isHidden ? (<div className={styles.lockIcon}>
						<LockIcon/>
					</div>) : ''}
				</div>
				<div className={styles.contentWrapper}>
					<div className={styles.content}>
						<Title level={3} className={styles.title}>{title}</Title>
						<Typography>
							<p className={styles.text}>{(followers_only && !isHidden && decryptedContent) ? decryptedContent : truncate(content)}</p>
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
					{isHidden && (<div className={styles.lockScreen}>
						<Button type="primary" >Follow to view</Button>
					</div>)}
				</div>
			</article>
		</div>
	)
}
