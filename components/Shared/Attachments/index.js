import {Button, Image} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import styles from './attachments.module.scss';

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
					<Image src={attachments[0].item} alt="attachment" preview={false}/>
					<Button
						size="large" icon={<CloseOutlined/>} type="default" className={styles.close} shape="circle"
						onClick={removeAttachment(attachments[0])}
					/>
				</div>))
			}
		</div>
	)
}
