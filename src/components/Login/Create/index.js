import {gql, useMutation} from '@apollo/client';
import {useAccount, useNetwork} from 'wagmi';
import {Form, Input, Typography, Button, Avatar, Spin} from 'antd';
import {useState} from "react";

const {Text, Title} = Typography;
import createStyles from "./create.module.css";
import uploadAssetsToIPFS from "../../../lib/uploadAssetsToIPFS";
import SwitchNetwork from "../../Shared/SwitchNetwork";
import {CHAIN_ID} from '../../../constants';
import Pending from './Pending';

const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfile($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
    }
  }
`


export default function Create() {
	const [form] = Form.useForm();
	const [avatar, setAvatar] = useState('');
	const [uploading, setUploading] = useState(false);
	const {data: account} = useAccount();
	const {activeChain} = useNetwork();

	const [createProfile, {data, loading}] = useMutation(
		CREATE_PROFILE_MUTATION
	)

	const handleUpload = async (e) => {
		e.preventDefault()
		setUploading(true)
		try {
			const attachment = await uploadAssetsToIPFS(e.target.files)
			if (attachment[0]?.item) {
				setAvatar(attachment[0].item)
			}
		} finally {
			setUploading(false)
		}
	}

	const onFinish = (values) => {
		const {handle} = values;
		const username = handle.toLowerCase();
		createProfile({
			variables: {
				request: {
					handle: username,
					profilePictureUri: avatar
						? avatar
						: `https://avatar.tobi.sh/${account?.address}_${username}.png`
				}
			}
		})
	};

	const AvatarUploadLabel = () => (<div className={createStyles.labelWrapper}>
		<Text className={createStyles.label}>Profile Photo</Text>
		<label htmlFor='avatar'>
			<input
				name="avatar"
				id="avatar"
				type="file"
				accept="image/*"
				style={{display: "none"}}
				onChange={handleUpload}
			/>
			<Text className={createStyles.upload}>Upload</Text>
		</label>
	</div>);

	return data?.createProfile?.txHash ? (
		<Pending
			handle={form.getFieldValue('handle')}
			txHash={data?.createProfile?.txHash}
		/>
	) : (
		<Form form={form} name="create-profile" size="large" layout="vertical" requiredMark={false} onFinish={onFinish}>
			<Title level={3} className={createStyles.heading}>Create Profile</Title>
			<Form.Item
				label={<Text className={createStyles.label}>Handle: </Text>}
				name="handle"
				rules={[
					{required: true, message: 'Please input your username!'},
					{min: 2, message: 'Handle should be at least 2 characters'},
					{max: 31, message: 'Handle should be less than 32 characters'},
					{pattern: /^[a-z0-9]+$/, message: 'Handle should only contain alphanumeric characters'}
				]}
			>
				<Input placeholder="vitalik"/>
			</Form.Item>
			<Form.Item
				rules={[{required: true, message: 'Please input your username!'}]}
			>
				<AvatarUploadLabel/>
				{uploading ? <Spin size="large" className={createStyles.spin}/> :
					<Avatar src={avatar} size={60} className={createStyles.avatar}/>}
			</Form.Item>
			<Form.Item>
				{activeChain?.id !== CHAIN_ID ? (
					<SwitchNetwork/>
				) : (
					<Button icon={ loading && <Spin />} type="primary" htmlType="submit" block>
						Create
					</Button>)}
			</Form.Item>
		</Form>
	)
}
