import styles from "./attachment.module.scss";
import {Spin, Tooltip} from 'antd';
import {AudioFileIcon, ImageFileIcon, VideoFileIcon} from "../Icons";
import uploadAssetsToIPFS from "../../../lib/uploadAssetsToIPFS";
import toast from "react-hot-toast";
import {useState, useId} from "react";

export default function Attachment({type, attachments, setAttachments}) {
	const [loading, setLoading] = useState(false);
	const id = useId();

	let icon = null;
	let fileTypes = '';

	switch (type) {
		case 'image':
			icon = <ImageFileIcon/>;
			fileTypes = 'image/*'
			break;
		case 'video':
			icon = <VideoFileIcon/>;
			fileTypes = 'video/*'
			break;
		case 'audio':
			icon = <AudioFileIcon/>;
			fileTypes = 'audio/*'
			break;
	}

	const handleUpload = async (e) => {
		e.preventDefault();

		setLoading(true);
		try {
			const attachment = await uploadAssetsToIPFS(e.target.files)
			console.log('attachment:', attachment);
			if (attachment) {
				setAttachments(attachment)
			}
		} catch (e) {
			toast.error(e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<label htmlFor={id} className={styles.uploadBtn}>
			<input
				name={`post_${type}`}
				id={id}
				type="file"
				accept={fileTypes}
				style={{display: "none"}}
				onChange={handleUpload}
			/>
			{
				loading ? (
					<Spin/>
				) : (
					<Tooltip title={type}>
						{icon}
					</Tooltip>
				)
			}

		</label>
	)
}
