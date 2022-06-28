import {Button, Modal, Form, Input, Space, Typography, Spin} from 'antd';

const {Text} = Typography;
import {gql, useMutation} from '@apollo/client'
import {useState, useContext} from 'react';
import {v4 as uuidv4} from 'uuid';
import toast from "react-hot-toast";
import {useNetwork, useAccount, useSignTypedData, useContractWrite} from "wagmi";
import AppContext from "../../utils/AppContext";
import styles from './newpost.module.scss';
import {SendOutlined} from '@ant-design/icons';
import {LensHubProxy} from '../../../abis/LensHubProxy';
import Attachment from '../../Shared/Attachment';
import Attachments from "../../Shared/Attachments";
import consoleLog from '../../../lib/consoleLog';
import omit from '../../../lib/omit';
import splitSignature from "../../../lib/splitSignature";
import SwitchNetwork from "../../Shared/SwitchNetwork";
import {BROADCAST_MUTATION} from "../../../graphql/BroadcastMutation";
import PubIndexStatus from "../../Shared/PubIndexStatus";
import {
	defaultFeeData,
	defaultModuleData,
	getModule
} from '../../../lib/getModule';
import uploadToIPFS from '../../../lib/uploadToIPFS';
import trimify from "../../../lib/trimify";

import {
	CHAIN_ID,
	CONNECT_WALLET,
	ERROR_MESSAGE,
	LENSHUB_PROXY,
	RELAY_ON,
	WRONG_NETWORK
} from '../../../constants';
import clsx from "clsx";

const {TextArea} = Input;

export const CREATE_POST_TYPED_DATA_MUTATION = gql`
  mutation CreatePostTypedData($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`

export default function NewPost() {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [onlyFollowers, setOnlyFollowers] = useState(false);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const [attachments, setAttachments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [postContentError, setPostContentError] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [selectedModule, setSelectedModule] = useState(defaultModuleData);
	const [feeData, setFeeData] = useState(defaultFeeData);


	const {currentUser} = useContext(AppContext)
	const {activeChain} = useNetwork()
	const {data: account} = useAccount()
	const {isLoading: signLoading, signTypedDataAsync} = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		}
	})

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onCompleted = () => {
		setAttachments([]);
		setTitle('');
		setContent('');
	}

	const onOnlyFollowersChecked = (e) => {
		setOnlyFollowers(e.target.checked);
	}

	const onTitleChanged = (e) => {
		setTitle(e.target.value);
	}

	const onContentChanged = (e) => {
		setContent(e.target.value);
	}

	const {
		data,
		error,
		isLoading: writeLoading,
		write
	} = useContractWrite(
		{
			addressOrName: LENSHUB_PROXY,
			contractInterface: LensHubProxy
		},
		'postWithSig',
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
			onCompleted({broadcast}) {
				if (broadcast?.reason !== 'NOT_ALLOWED') {
					onCompleted()
				}
			},
			onError(error) {
				consoleLog('Relay Error', '#ef4444', error.message)
			}
		})

	const [createPostTypedData, {loading: typedDataLoading}] = useMutation(
		CREATE_POST_TYPED_DATA_MUTATION,
		{
			onCompleted({
							createPostTypedData
						}) {
				consoleLog('Mutation', '#4ade80', 'Generated createPostTypedData')
				const {id, typedData} = createPostTypedData
				const {
					profileId,
					contentURI,
					collectModule,
					collectModuleInitData,
					referenceModule,
					referenceModuleInitData
				} = typedData?.value

				signTypedDataAsync({
					domain: omit(typedData?.domain, '__typename'),
					types: omit(typedData?.types, '__typename'),
					value: omit(typedData?.value, '__typename')
				}).then((signature) => {
					const {v, r, s} = splitSignature(signature)
					const sig = {v, r, s, deadline: typedData.value.deadline}
					const inputStruct = {
						profileId,
						contentURI,
						collectModule,
						collectModuleInitData,
						referenceModule,
						referenceModuleInitData,
						sig
					}
					if (RELAY_ON) {
						broadcast({variables: {request: {id, signature}}}).then(
							({data: {broadcast}, errors}) => {
								if (errors || broadcast?.reason === 'NOT_ALLOWED') {
									write({args: inputStruct})
								}
							}
						)
					} else {
						write({args: inputStruct})
					}
				})
			},
			onError(error) {
				toast.error(error.message ?? ERROR_MESSAGE)
			}
		}
	)

	const createPost = async () => {
		if (!account?.address) {
			toast.error(CONNECT_WALLET)
		} else if (activeChain?.id !== CHAIN_ID) {
			toast.error(WRONG_NETWORK)
		} else if (title?.length === 0 && content?.length === 0 && attachments.length === 0) {
			setPostContentError('Post should not be empty!')
		} else {
			setPostContentError('')
			setIsUploading(true)
			const {path} = await uploadToIPFS({
				version: '1.0.0',
				metadata_id: uuidv4(),
				description: trimify(content),
				content: JSON.stringify({
					title: trimify(title),
					content: trimify(content),
				}),
				createdAt: new Date(),
				external_url: null,
				image: attachments.length > 0 ? attachments[0]?.item : null,
				imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
				name: `Post by @${currentUser?.handle}`,
				attributes: [
					{
						traitType: 'string',
						key: 'type',
						value: 'post'
					}
				],
				media: attachments,
				appId: 'Polyfans'
			}).finally(() => setIsUploading(false))

			await createPostTypedData({
				variables: {
					request: {
						profileId: currentUser?.id,
						contentURI: `https://ipfs.infura.io/ipfs/${path}`,
						collectModule: feeData.recipient
							? {
								[getModule(selectedModule.moduleName).config]: feeData
							}
							: getModule(selectedModule.moduleName).config,
						referenceModule: {
							followerOnlyReferenceModule: onlyFollowers
						}
					}
				}
			})
		}
	}

	return (
		<div>
			<Button type="primary" onClick={showModal}>New post</Button>
			<Modal
				visible={isModalVisible} footer={null} onOk={handleOk} onCancel={handleCancel} closable={false}
				width={600}
			>
				<Form
					form={form} name="new-post" layout="vertical" requiredMark={false} className={styles.form}
					onFinish={createPost}
				>
					<div>
						<Form.Item
							name="title"
						>
							<Input
								placeholder="Post Title" className={clsx(styles.input)} onChange={onTitleChanged}
								value={title}
							/>
						</Form.Item>
						<Form.Item
							name="content"
						>
							<TextArea
								placeholder="Some details..." className={clsx(styles.input, styles.textarea)}
								onChange={onContentChanged} value={content}
							/>
						</Form.Item>
						{postContentError && <Text className={styles.error}>{postContentError}</Text>}
					</div>
					<div className={styles.footer}>
						<Space size={30} className={styles.footerControls}>
							<Attachment type='image' attachments={attachments} setAttachments={setAttachments}/>
							<Attachment type='video' attachments={attachments} setAttachments={setAttachments}/>
							<Attachment type='audio' attachments={attachments} setAttachments={setAttachments}/>

							<label htmlFor='followers_only' className={styles.checkbox}>
								<input
									name="followers_only"
									id="followers_only"
									type="checkbox"
									onChange={onOnlyFollowersChecked}
								/>
								<span>Followers only content</span>
							</label>
						</Space>
						<Space size={20}>
							{data?.hash ?? broadcastData?.broadcast?.txHash ? (
								<PubIndexStatus
									setIsModalVisible={setIsModalVisible}
									type="Post"
									txHash={
										data?.hash ? data?.hash : broadcastData?.broadcast?.txHash
									}
								/>) : null}
							{activeChain?.id !== CHAIN_ID ? (
									<SwitchNetwork/>
								) :
								(<Button
									disabled={isUploading ||
									typedDataLoading ||
									signLoading ||
									writeLoading ||
									broadcastLoading}
									onClick={createPost}
									icon={
										isUploading ||
										typedDataLoading ||
										signLoading ||
										writeLoading ||
										broadcastLoading ? (
											<Spin style={{marginRight: '15px'}}/>
										) : (
											<SendOutlined size={20}/>
										)
									}
									size="large"
									type="primary"
									htmlType="submit"
									className={styles.submit}
								>{isUploading
									? 'Uploading to IPFS'
									: typedDataLoading
										? 'Generating Post'
										: signLoading
											? 'Sign'
											: writeLoading || broadcastLoading
												? 'Send'
												: ''}</Button>)}
						</Space>
					</div>
				</Form>
				{attachments && attachments.length > 0 && <div className={styles.attachmentsWrapper}>
					<Attachments attachments={attachments} setAttachments={setAttachments}/>
				</div>}
			</Modal>
		</div>

	)
}
