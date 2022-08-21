import styles from './settings.module.scss';
import {gql, useMutation, useQuery} from "@apollo/client";
import {Button, Form, Input, Spin, Typography, Divider} from 'antd';
import {useContext, useEffect, useState} from "react";

const {Title, Text} = Typography;
import ImageUpload from "../Shared/ImageUpload";
import Link from "next/link";
import AppContext from "../utils/AppContext";
import {APP_NAME, CONNECT_WALLET, LENS_PERIPHERY, ERRORS, RELAY_ON, ERROR_MESSAGE} from "../../constants";
import toast from "react-hot-toast";
import uploadToIPFS from "../../lib/uploadToIPFS";
import {useAccount, useContractWrite, useSignTypedData} from 'wagmi';
import {LensPeriphery} from "../../abis/LensPeriphery";
import {BROADCAST_MUTATION} from "../../graphql/BroadcastMutation";
import consoleLog from "../../lib/consoleLog";
import omit from '../../lib/omit';
import splitSignature from '../../lib/splitSignature';
import {v4 as uuidv4} from 'uuid';
import AvatarSettingsForm from "./AvatarSettingsForm";


const CREATE_SET_PROFILE_METADATA_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileMetadataTypedData(
    $request: CreatePublicSetProfileMetadataURIRequest!
  ) {
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          metadata
        }
      }
    }
  }
`

export default function Settings({user}) {
	const {currentUser} = useContext(AppContext);
	const [settingsForm] = Form.useForm();

	const [coverImage, setCoverImage] = useState(user?.coverPicture?.original?.url);

	useEffect(()=> {
		settingsForm.setFieldsValue({
			'id': user?.id,
			'handle': user?.handle,
			'name': user?.name,
			'bio': user?.bio
		});
	}, [user])


	const {data: account} = useAccount();
	const [isUploading, setIsUploading] = useState(false);

	const onCompleted = () => {
		toast.success('Profile updated successfully!')
	}

	const {isLoading: signLoading, signTypedDataAsync} = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		}
	})

	const {
		data: writeData,
		isLoading: writeLoading,
		error,
		write
	} = useContractWrite(
		{
			addressOrName: LENS_PERIPHERY,
			contractInterface: LensPeriphery
		},
		'setProfileMetadataURIWithSig',
		{
			onSuccess() {
				onCompleted()
			},
			onError(error) {
				toast.error(error?.data?.message ?? error?.message)
			}
		}
	)

	const [broadcast, {data: broadcastData, loading: broadcastLoading}] =
		useMutation(BROADCAST_MUTATION, {
			onCompleted,
			onError(error) {
				if (error.message === ERRORS.notMined) {
					toast.error(error.message)
				}
				consoleLog('Relay Error', '#ef4444', error.message)
			}
		})

	const [createSetProfileMetadataTypedData, {loading: typedDataLoading}] =
		useMutation(CREATE_SET_PROFILE_METADATA_TYPED_DATA_MUTATION, {
			async onCompleted({createSetProfileMetadataTypedData}) {
				consoleLog('Mutation', 'Generated createSetProfileImageURITypedData')
				const {id, typedData} = createSetProfileMetadataTypedData
				const {deadline} = typedData?.value

				try {
					const signature = await signTypedDataAsync({
						domain: omit(typedData?.domain, '__typename'),
						types: omit(typedData?.types, '__typename'),
						value: omit(typedData?.value, '__typename')
					})
					const {profileId, metadata} = typedData?.value
					const {v, r, s} = splitSignature(signature)
					const sig = {v, r, s, deadline}
					const inputStruct = {
						user: currentUser?.ownedBy,
						profileId,
						metadata,
						sig
					}
					if (RELAY_ON) {
						const {
							data: {broadcast: result}
						} = await broadcast({variables: {request: {id, signature}}})

						if ('reason' in result) write({args: inputStruct})
					} else {
						write({args: inputStruct})
					}
				} catch (error) {
					consoleLog('Sign Error', error)
				}
			},
			onError(error) {
				toast.error(error.message ?? ERROR_MESSAGE)
			}
		})


	async function onFinish(values) {
		if (!currentUser) return toast.error(CONNECT_WALLET);

		setIsUploading(true);
		const {name, bio} = values;


		const {path} = await uploadToIPFS({
			name,
			bio,
			cover_picture: coverImage ? coverImage : null,
			attributes: [
				{
					traitType: 'string',
					key: 'app',
					value: APP_NAME
				}
			],
			version: '1.0.0',
			metadata_id: uuidv4(),
			previousMetadata: user?.metadata,
			createdOn: new Date(),
			appId: APP_NAME
		}).finally(() => setIsUploading(false))

		createSetProfileMetadataTypedData({
			variables: {
				request: {
					profileId: currentUser?.id,
					metadata: `https://ipfs.infura.io/ipfs/${path}`
				}
			}
		})

		toast.success('Profile updated successfully!')

	}

	return user && <div className={styles.settings}>
		<Form
			form={settingsForm}
			name="settings" layout="vertical" requiredMark={false} onFinish={onFinish}
			className={styles.settingsForm}
		>
			<div className={styles.section}>
				<Title level={2}>Basic</Title>
				<Form.Item
					label={<Text className={styles.label}>Profile Id: </Text>}
					name="id"
				>
					<Input disabled={true}/>
				</Form.Item>
				<Form.Item
					label={<Text className={styles.label}>Handle: </Text>}
					name="handle"
				>
					<Input disabled={true} value={user?.handle}/>
				</Form.Item>
				<Form.Item
					label={<Text className={styles.label}>Name: </Text>}
					name="name"
					rules={[
						{min: 2, message: 'Name should be at least 2 characters'},
						{max: 100, message: 'Name should be less than 100 characters'},
					]}
				>
					<Input placeholder="Vitalik Buterin" value={user.name}/>
				</Form.Item>

				<Form.Item
					label={<Text className={styles.label}>About: </Text>}
					name="bio"
					rules={[
						{max: 260, message: 'Bio should be less than 260 characters'},
					]}
				>
					<Input.TextArea rows={6} placeholder="Write a few lines about yourself, your values and interests"/>
				</Form.Item>
			</div>
			<Divider className={styles.divider}/>
			<div className={styles.section}>
				<Title level={2}>Appearance</Title>
				<Form.Item>
					<ImageUpload name='cover' image={coverImage} setImage={setCoverImage} label='Cover Photo'/>
				</Form.Item>
			</div>
			<Divider className={styles.divider}/>
			<div className={styles.section}>
				<Form.Item>
					<Button
						disabled={
							isUploading ||
							typedDataLoading ||
							signLoading ||
							writeLoading ||
							broadcastLoading
						}
						icon={
							isUploading ||
							typedDataLoading ||
							signLoading ||
							writeLoading ||
							broadcastLoading ? (
								<Spin style={{marginRight: '15px'}}/>
							) : null
						}
						type="primary"
						htmlType="submit"
					>
						Save
					</Button>
				</Form.Item>
			</div>
		</Form>
		<AvatarSettingsForm className={styles.avatarForm} user={user}/>
	</div>
}
