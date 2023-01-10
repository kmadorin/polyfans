import {Button, Image} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import styles from './attachments.module.scss';
import { Player } from '@livepeer/react';

export default function Attachments({attachments, setAttachments}) {
	const removeAttachment = (attachment) => () => {
		const arr = attachments
		setAttachments(
			arr.filter(function (elem) {
				return elem !== attachment
			})
		)
	}

	return attachments && attachments.length > 0 && (
		<div className={styles.attachments}>
			{attachments.map(attachment => (
				<div key={attachment.item} className={styles.attachment}>
					{attachment.type.startsWith('image') && <Image src={attachments[0].item} alt="attachment" preview={false}/>}
					{attachment.type.startsWith('video') && <Player title={''} src={attachments[0].item} muted/>}
					<Button
						size="large" icon={<CloseOutlined/>} type="default" className={styles.close} shape="circle"
						onClick={removeAttachment(attachments[0])}
					/>
				</div>))
			}
		</div>
	)
}
