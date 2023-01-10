import {useContext, useState} from "react";
import {useSigner} from "wagmi";
import toast from 'react-hot-toast';
import {gql, useMutation} from '@apollo/client';
import {Button, Spin} from "antd";
import consoleLog from '../../lib/consoleLog';
import omit from '../../lib/omit';
import splitSignature from '../../lib/splitSignature';
import AppContext from "../utils/AppContext";
import { Contract } from 'ethers';
import { FollowNFT } from '../../abis/FollowNFT';


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
	WRONG_NETWORK
} from '../../constants';

const CREATE_UNFOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateUnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
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
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`

export default function Unfollow({profile, showText=false, setFollowing, followersCount, setFollowersCount}) {
	const {currentUser} = useContext(AppContext);

	const {chain: activeChain} = useNetwork();
	const {data: account} = useAccount();
	const [writeLoading, setWriteLoading] = useState(false);
	const {isLoading: signLoading, signTypedDataAsync} = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		}
	})

	const { data: signer } = useSigner()

	const [createUnfollowTypedData, {loading: typedDataLoading}] = useMutation(
		CREATE_UNFOLLOW_TYPED_DATA_MUTATION,
		{
			async onCompleted({createUnfollowTypedData}) {
				consoleLog('Mutation', '#4ade80', 'Generated createUnfollowTypedData')
				const {typedData} = createUnfollowTypedData;
				const { deadline } = typedData?.value;

				try {
					const signature = await signTypedDataAsync({
						domain: omit(typedData?.domain, '__typename'),
						types: omit(typedData?.types, '__typename'),
						value: omit(typedData?.value, '__typename')
					});

					const { tokenId } = typedData?.value
					const {v, r, s} = splitSignature(signature)
					const sig = {v, r, s, deadline}

					setWriteLoading(true)

					try {
						const followNftContract = new Contract(
							typedData.domain.verifyingContract,
							FollowNFT,
							signer
						)

						const tx = await followNftContract.burnWithSig(tokenId, sig)
						if (tx) {
							if (followersCount && setFollowersCount) {
								setFollowersCount(followersCount - 1)
							}
							setFollowing(false)
						}
						toast.success('Unfollowed successfully!')
					} catch (e) {
						toast.error('User rejected request')
					} finally {
						setWriteLoading(false)
					}
				} catch(e) {
					consoleLog('Mutation', '#4ade80', '[Sign Error]')
				}
			},
			onError(error) {
				toast.error(error.message ?? ERROR_MESSAGE)
			}
		}
	)

	const createUnfollow = () => {
		if (!account?.address && !currentUser) {
			toast.error(CONNECT_WALLET)
		} else if (activeChain?.id !== CHAIN_ID) {
			toast.error(WRONG_NETWORK)
		} else {
			createUnfollowTypedData({
				variables: {
					request: { profile: profile?.id }
				}
			})
		}
	}

	return (
		<Button
			icon={typedDataLoading || signLoading || writeLoading && <Spin/>}
			type="default"
			disabled={
				typedDataLoading || signLoading || writeLoading
			}
			onClick={createUnfollow}
			>
			{showText && 'Unfollow'}
		</Button>
	)
}
