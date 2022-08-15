import {Avatar, Button, Form, Input, Spin, Typography} from "antd";

const {Text} = Typography;
import {gql, useMutation} from '@apollo/client';

const {TextArea} = Input;
import {LensHubProxy} from '../../../../abis/LensHubProxy';
import getAvatar from "../../../../lib/getAvatar";
import {SendOutlined} from "@ant-design/icons";
import styles from './newComments.module.scss';
import {useState} from "react";
import {useContractWrite, useNetwork, useSignTypedData} from 'wagmi';
import toast from "react-hot-toast";
import {BROADCAST_MUTATION} from "../../../../graphql/BroadcastMutation";
import consoleLog from "../../../../lib/consoleLog";
import omit from '../../../../lib/omit';
import uploadToIPFS from '../../../../lib/uploadToIPFS';
import trimify from "../../../../lib/trimify";
import splitSignature from "../../../../lib/splitSignature";
import PubIndexStatus from "../../../Shared/PubIndexStatus";
import {
	defaultModuleData,
	getModule
} from '../../../../lib/getModule';
import {v4 as uuidv4} from 'uuid';

import {
	CHAIN_ID,
	CONNECT_WALLET,
	ERROR_MESSAGE,
	LENSHUB_PROXY,
	RELAY_ON,
	APP_NAME
} from '../../../../constants';
import SwitchNetwork from "../../../Shared/SwitchNetwork";

const CREATE_COMMENT_TYPED_DATA_MUTATION = gql`
  mutation CreateCommentTypedData(
    $options: TypedDataOptions
    $request: CreatePublicCommentRequest!
  ) {
    createCommentTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

export default function NewComment({currentUser, post}) {
	const isFollowing = true;
	const [newComment, setNewComment] = useState('');
	const [commentContentError, setCommentContentError] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [isIndexingStatusVisible, setIndexingStatusVisible] = useState(true);
	const {activeChain} = useNetwork();

	const {isLoading: signLoading, signTypedDataAsync} = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		}
	})

	const onNewCommentChanged = (e) => {
		setNewComment(e.target.value);
	}

	const onCompleted = () => {
		setNewComment('')
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
		'commentWithSig',
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
			onCompleted(data) {
				if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
					onCompleted()
				}
			},
			onError(error) {
				if (error.message === ERRORS.notMined) {
					toast.error(error.message)
				}
				consoleLog('Relay Error', '#ef4444', error.message)
			}
		})
	const [createCommentTypedData, {loading: typedDataLoading}] = useMutation(
		CREATE_COMMENT_TYPED_DATA_MUTATION,
		{
			onCompleted({
							createCommentTypedData
						}) {
				consoleLog('Mutation', '#4ade80', 'Generated createCommentTypedData')
				const {id, typedData} = createCommentTypedData
				const {
					profileId,
					profileIdPointed,
					pubIdPointed,
					contentURI,
					collectModule,
					collectModuleInitData,
					referenceModule,
					referenceModuleData,
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
						profileIdPointed,
						pubIdPointed,
						contentURI,
						collectModule,
						collectModuleInitData,
						referenceModule,
						referenceModuleData,
						referenceModuleInitData,
						sig
					}
					if (RELAY_ON) {
						broadcast({variables: {request: {id, signature}}}).then(
							({data, errors}) => {
								if (errors || data?.broadcast?.reason === 'NOT_ALLOWED') {
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

	const createComment = async () => {
		if (!currentUser) return toast.error(CONNECT_WALLET)

		if (newComment.length === 0) {
			return setCommentContentError('Comment should not be empty!')
		}

		setCommentContentError('')
		setIsUploading(true)

		const {path} = await uploadToIPFS({
			version: '1.0.0',
			metadata_id: uuidv4(),
			description: trimify(newComment),
			content: trimify(newComment),
			image: null,
			createdAt: new Date(),
			imageMimeType: null,
			name: `Comment by @${currentUser?.handle}`,
			attributes: [
				{
					traitType: 'string',
					key: 'type',
					value: 'comment'
				}
			],
			media: [],
			createdOn: new Date(),
			appId: APP_NAME
		}).finally(() => setIsUploading(false))

		await createCommentTypedData({
			variables: {
				request: {
					profileId: currentUser?.id,
					publicationId: post?.id,
					contentURI: `https://ipfs.infura.io/ipfs/${path}`,
					collectModule: getModule(defaultModuleData.moduleName).config,
					referenceModule: {followerOnlyReferenceModule: false}
				}
			}
		})
	}

	return (<Form requiredMark={false} onFinish={createComment} className={styles.form}>
			{currentUser && <Avatar size={32} src={getAvatar(currentUser)} alt={currentUser?.handle} className={styles.avatar}/>}
			<div>
				{commentContentError && <Text className={styles.error}>{commentContentError}</Text>}
			</div>
			{currentUser ? (isFollowing ? (<>
				<TextArea
					required
					rows={1}
					placeholder="Add comment..." className={styles.newCommentInput}
					onChange={onNewCommentChanged} value={newComment}
				/>
				{activeChain?.id !== CHAIN_ID ? (
						<SwitchNetwork/>
					) :
					(<Button
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
							) : (
								<SendOutlined size={20}/>
							)
						}
						size="large"
						type="primary"
						htmlType="submit"
						className={styles.submitBtn}
					>
						{isUploading
							? 'Uploading to IPFS'
							: typedDataLoading
								? 'Generating Comment'
								: signLoading
									? 'Sign'
									: writeLoading || broadcastLoading
										? 'Send'
										: ''}
					</Button>)}
			</>) : (<div className={styles.onlyFollowers}>Only followers can comment</div>)) : (<div> You must be logged in to comment</div>)}
			{/*{data?.hash ?? broadcastData?.broadcast?.txHash ? (*/}
			{/*	<div className={styles.status}>*/}
			{/*		<PubIndexStatus*/}
			{/*			type="Comment"*/}
			{/*			txHash={*/}
			{/*				data?.hash ? data?.hash : broadcastData?.broadcast?.txHash*/}
			{/*			}*/}
			{/*		/>*/}
			{/*	</div>) : null}*/}
	< /Form>)
}
