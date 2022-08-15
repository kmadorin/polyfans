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
import ImageUpload from "../../Shared/ImageUpload";

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
	const {data: account} = useAccount();
	const {activeChain} = useNetwork();

	const [createProfile, {data, loading}] = useMutation(
		CREATE_PROFILE_MUTATION
	)

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
			<Form.Item>
				<ImageUpload name='avatar' image={avatar} setImage={setAvatar} label='Profile Photo' isAvatar />
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
