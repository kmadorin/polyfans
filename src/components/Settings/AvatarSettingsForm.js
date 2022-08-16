import {Button, Form, Spin} from 'antd';
import ImageUpload from "../Shared/ImageUpload";
import {useContext, useState} from "react";
import {gql, useMutation} from '@apollo/client';
import toast from "react-hot-toast";
import {LENSHUB_PROXY, ERRORS, RELAY_ON, ERROR_MESSAGE} from "../../constants";
import {LensHubProxy} from "../../abis/LensHubProxy";
import {BROADCAST_MUTATION} from "../../graphql/BroadcastMutation";
import consoleLog from "../../lib/consoleLog";
import omit from '../../lib/omit';
import splitSignature from '../../lib/splitSignature';
import {useContractWrite, useSignTypedData} from 'wagmi'
import AppContext from "../utils/AppContext";

const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileImageUriTypedData(
    $options: TypedDataOptions
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(options: $options, request: $request) {
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
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`

export default function AvatarSettingsForm({user, ...props}) {
	const [avatar, setAvatar] = useState(user?.picture?.original?.url);
	const {currentUser} = useContext(AppContext);

	const {isLoading: signLoading, signTypedDataAsync} = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		}
	})

	const onCompleted = () => {
		toast.success('Avatar updated successfully!')
	}

	const {
		data: writeData,
		isLoading: writeLoading,
		error,
		write
	} = useContractWrite({
			addressOrName: LENSHUB_PROXY,
			contractInterface: LensHubProxy
		},
		'setProfileImageURIWithSig',
		{
			onSuccess() {
				onCompleted()
			},
			onError(error) {
				toast.error(error?.data?.message ?? error?.message)
			}
		})

	const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
		useMutation(BROADCAST_MUTATION, {
			onCompleted,
			onError(error) {
				if (error.message === ERRORS.notMined) {
					toast.error(error.message)
				}
				consoleLog('Relay Error', error.message)
			}
		})

	const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
		useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION, {
			async onCompleted({createSetProfileImageURITypedData}) {
				consoleLog('Mutation', 'Generated createSetProfileImageURITypedData')
				const { id, typedData } = createSetProfileImageURITypedData
				const { deadline } = typedData?.value

				try {
					const signature = await signTypedDataAsync({
						domain: omit(typedData?.domain, '__typename'),
						types: omit(typedData?.types, '__typename'),
						value: omit(typedData?.value, '__typename')
					})
					const { profileId, imageURI } = typedData?.value
					const { v, r, s } = splitSignature(signature)
					const sig = { v, r, s, deadline }
					const inputStruct = {
						profileId,
						imageURI,
						sig
					}
					if (RELAY_ON) {
						const {
							data: { broadcast: result }
						} = await broadcast({ variables: { request: { id, signature } } })

						if ('reason' in result) write({ args: inputStruct })
					} else {
						write({ args: inputStruct })
					}
				} catch (error) {
					consoleLog('Sign Error', error)
				}
			},
			onError(error) {
				toast.error(error.message ?? ERROR_MESSAGE)
			}
		})

function onFinish() {
	if (!currentUser) return toast.error(CONNECT_WALLET)
	if (!avatar) return toast.error("Avatar can't be empty!")

	createSetProfileImageURITypedData({
		variables: {
			request: {
				profileId: currentUser?.id,
				url: avatar
			}
		}
	})
}


return (<Form onFinish={onFinish} {...props}>
	<Form.Item>
		<ImageUpload name='avatar' image={avatar} setImage={setAvatar} label='Profile Photo' isAvatar/>
	</Form.Item>
	<Form.Item>
		<Button
			disabled={
				typedDataLoading || signLoading || writeLoading || broadcastLoading
			}
			icon={
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
</Form>)
}
