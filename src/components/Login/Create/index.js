import {gql, useMutation} from '@apollo/client';
import {useAccount, useNetwork, useConnect, useContractWrite, useSigner} from 'wagmi';
import {Form, Input, Typography, Button, Avatar, Spin} from 'antd';
import {useState} from "react";

const {Text, Title} = Typography;
import createStyles from "./create.module.css";
import uploadAssetsToIPFS from "../../../lib/uploadAssetsToIPFS";
import SwitchNetwork from "../../Shared/SwitchNetwork";
import {CHAIN_ID, LENSHUB_PROXY, ZERO_ADDRESS, MOCK_PROFILE_CREATION_PROXY} from '../../../constants';
import Pending from './Pending';
import ImageUpload from "../../Shared/ImageUpload";
import {LensHubProxy} from "../../../abis/LensHubProxy";
import {IMockProfileCreationProxy} from "../../../abis/IMockProfileCreationProxy";

import toast from "react-hot-toast";
import {ethers} from "ethers";
import Router from "next/router";


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
	const {chain: activeChain} = useNetwork();
	const {activeConnector} = useConnect();
	const {data: signer, isError, isLoading} = useSigner()

	const {
		data: createProfileData,
		error,
		isLoading: writeLoading,
		write
	} = useContractWrite(
		{
			addressOrName: MOCK_PROFILE_CREATION_PROXY,
			contractInterface: IMockProfileCreationProxy
		},
		'proxyCreateProfile',
		{
			onError(error) {
				toast.error(error?.data?.message ?? error?.message)
			}
		}
	)

	// const LensHubProxyInterface = new ethers.utils.Interface([
	// 	'function createProfile(address to, string handle, string imageURI, address followModule, bytes followModuleInitData, string followNFTURI)'
	// ])

	// const erc20Interface = new ethers.utils.Interface([
	// 	'function transfer(address _to, uint256 _value)'
	// ])


	const [createProfile, {data, loading}] = useMutation(
		CREATE_PROFILE_MUTATION
	)

	const onFinish = (values) => {
		const {handle} = values;
		const username = handle.toLowerCase();

		if (activeConnector.id === 'sequence') {
			const profileData = {
				to: account.address,
				handle,
				imageURI: avatar
					? avatar
					: `https://avatar.tobi.sh/${account?.address}_${username}.png`,
				followModule: ZERO_ADDRESS,
				followModuleInitData: [],
				followNFTURI: 'https://polyfans.infura-ipfs.io/ipfs/QmTFLSXdEQ6qsSzaXaCSNtiv6wA56qq87ytXJ182dXDQJS',
			};


			// const profileValues = [
			// 	account.address,
			// 	handle,
			// 	avatar ? avatar : `https://avatar.tobi.sh/${account?.address}_${username}.png`,
			// 	ZERO_ADDRESS,
			// 	'0x',
			// 	'https://polyfans.infura-ipfs.io/ipfs/QmTFLSXdEQ6qsSzaXaCSNtiv6wA56qq87ytXJ182dXDQJS'
			// ]

			// console.log(`###: profileValues`, profileValues)
			// console.log('###: encodedParams', ethers.utils.defaultAbiCoder.encode(
			// 	['address', 'string', 'string', 'address', 'bytes', 'string'],
			// 	['0x9e0f0d83dD880240e3506A7Ac4CE82500b2bD92B', "kmadorin4", "https://polyfans.infura-ipfs.io/ipfs/QmdXTbYNphMiqrKqYskFn3AtmfR6XCLXRRAJ2kuqSTsJHw", "0x0000000000000000000000000000000000000000",[],"https://polyfans.infura-ipfs.io/ipfs/QmTFLSXdEQ6qsSzaXaCSNtiv6wA56qq87ytXJ182dXDQJS"]
			// ));

// ['address', '0x9e0f0d83dD880240e3506A7Ac4CE82500b2bD92B'], 'string', "kmadorin4", 'string', "https://polyfans.infura-ipfs.io/ipfs/QmdXTbYNphMiqrKqYskFn3AtmfR6XCLXRRAJ2kuqSTsJHw", 'address', "0x0000000000000000000000000000000000000000",'bytes', [], 'string', "https://polyfans.infura-ipfs.io/ipfs/QmTFLSXdEQ6qsSzaXaCSNtiv6wA56qq87ytXJ182dXDQJS"]


			// const transactionData = IMockProfileCreationProxy.encodeFunctionData(
			// 	'proxyCreateProfile', [
			// 		account.address,
			// 		handle,
			// 		avatar ? avatar : `https://avatar.tobi.sh/${account?.address}_${username}.png`,
			// 		ZERO_ADDRESS,
			// 		'0x',
			// 		'https://polyfans.infura-ipfs.io/ipfs/QmTFLSXdEQ6qsSzaXaCSNtiv6wA56qq87ytXJ182dXDQJS'
			// 	]
			// )
			//
			//
			// const transaction = {
			// 	to: MOCK_PROFILE_CREATION_PROXY,
			// 	data: transactionData,
			// 	gasLimit: 20000000
			// }
			//
			// const txnResponse = await signer.sendTransaction(transaction)
			// const res = await txnResponse.wait();
			// console.log(`###: res`, res)
			write({args: profileData})
		} else {
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
		}
	};

	return data?.createProfile?.txHash || writeLoading ? (
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
				<ImageUpload name='avatar' image={avatar} setImage={setAvatar} label='Profile Photo' isAvatar/>
			</Form.Item>
			<Form.Item>
				{activeChain?.id !== CHAIN_ID ? (
					<SwitchNetwork/>
				) : (
					<Button icon={loading && <Spin/>} type="primary" htmlType="submit" block>
						Create
					</Button>)}
			</Form.Item>
		</Form>
	)
}
