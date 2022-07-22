import {useContext} from "react";
import toast from 'react-hot-toast';
import {gql, useMutation} from '@apollo/client';
import {Button, Spin} from "antd";
import {BROADCAST_MUTATION} from '../../graphql/BroadcastMutation';
import {LensHubProxy} from '../../abis/LensHubProxy';
import consoleLog from '../../lib/consoleLog';
import omit from '../../lib/omit';
import splitSignature from '../../lib/splitSignature';
import AppContext from "../utils/AppContext";


import {
	useAccount,
	useContractWrite,
	useNetwork,
	useSignTypedData
} from 'wagmi';
import {
	CHAIN_ID,
	CONNECT_WALLET,
	ERROR_MESSAGE,
	LENSHUB_PROXY,
	RELAY_ON,
	WRONG_NETWORK
} from '../../constants';

const CREATE_FOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateFollowTypedData($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`

export default function Follow({profile, showText=false, setFollowing, followersCount, setFollowersCount}) {
	const {currentUser} = useContext(AppContext);

	const {activeChain} = useNetwork()
	const {data: account} = useAccount()
	const {isLoading: signLoading, signTypedDataAsync} = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		}
	})

	const onCompleted = () => {
		if (followersCount && setFollowersCount) {
			setFollowersCount(followersCount + 1)
		}
		setFollowing(true)
		toast.success('Followed successfully!')
	}

	const {isLoading: writeLoading, write} = useContractWrite(
		{
			addressOrName: LENSHUB_PROXY,
			contractInterface: LensHubProxy
		},
		'followWithSig',
		{
			onSuccess() {
				onCompleted()
			},
			onError(error) {
				toast.error(error?.data?.message ?? error?.message)
			}
		}
	)

	const [broadcast, {loading: broadcastLoading}] = useMutation(
		BROADCAST_MUTATION,
		{
			onCompleted({broadcast}) {
				if (broadcast?.reason !== 'NOT_ALLOWED') {
					onCompleted()
				}
			},
			onError(error) {
				consoleLog('Relay Error', '#ef4444', error.message)
			}
		}
	)

	const [createFollowTypedData, {loading: typedDataLoading}] = useMutation(
		CREATE_FOLLOW_TYPED_DATA_MUTATION,
		{
			onCompleted({createFollowTypedData}) {
				consoleLog('Mutation', '#4ade80', 'Generated createFollowTypedData')
				const {id, typedData} = createFollowTypedData
				signTypedDataAsync({
					domain: omit(typedData?.domain, '__typename'),
					types: omit(typedData?.types, '__typename'),
					value: omit(typedData?.value, '__typename')
				}).then((signature) => {
					const {profileIds, datas: followData} = typedData?.value
					const {v, r, s} = splitSignature(signature)
					const sig = {v, r, s, deadline: typedData.value.deadline}
					const inputStruct = {
						follower: account?.address,
						profileIds,
						datas: followData,
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

	const createFollow = () => {
		if (!account?.address) {
			toast.error(CONNECT_WALLET)
		} else if (activeChain?.id !== CHAIN_ID) {
			toast.error(WRONG_NETWORK)
		} else {
			createFollowTypedData({
				variables: {
					request: {
						follow: {
							profile: profile?.id,
							followModule:
								profile?.followModule?.__typename ===
								'ProfileFollowModuleSettings'
									? {profileFollowModule: {profileId: currentUser?.id}}
									: null
						}
					}
				}
			})
		}
	}

	return (
		<Button
			icon={typedDataLoading || signLoading || writeLoading || broadcastLoading && <Spin/>}
			type="default"
			disabled={
				typedDataLoading || signLoading || writeLoading || broadcastLoading
			}
			onClick={createFollow}
			>
			{showText && 'Follow'}
		</Button>
	)
}
