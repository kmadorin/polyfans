import {Avatar, Spin, Typography} from "antd";
const {Text} = Typography;

import styles from './imageUpload.module.scss';
import {useState} from "react";
import uploadAssetsToIPFS from "../../../lib/uploadAssetsToIPFS";

export default function ImageUpload({name, label, isAvatar = false, image= null, setImage}) {
	const [uploading, setUploading] = useState(false);

	const handleUpload = async (e) => {
		e.preventDefault()
		setUploading(true)
		try {
			const attachment = await uploadAssetsToIPFS(e.target.files)
			if (attachment[0]?.item) {
				setImage(attachment[0].item)
			}
		} finally {
			setUploading(false)
		}
	}

	const ImageUploadLabel = () => (<div className={styles.labelWrapper}>
		<Text className={styles.label}>{label}</Text>
		<label htmlFor={name}>
			<input
				name={name}
				id={name}
				type="file"
				accept="image/*"
				style={{display: "none"}}
				onChange={handleUpload}
			/>
			<Text className={styles.upload}>Upload</Text>
		</label>
	</div>);

	return (
		<>
			<ImageUploadLabel />
			{uploading ? <Spin size="large" className={styles.spin}/> :
				isAvatar ? <Avatar src={image} size={60} className={styles.avatar} alt='profile photo'/> : <div className={styles.preview} style={{backgroundImage: image ? `url(${image})` : null}}/>}
		</>
	)
}
