import { gql, useLazyQuery, useMutation } from '@apollo/client';
import {useAccount, useNetwork, useConnect, useSignMessage} from 'wagmi';
import Cookies from 'js-cookie';
import {Button} from 'antd';
import Icon from '@ant-design/icons';
import {useContext} from 'react';
import Router from 'next/router';
import AppContext from '../utils/AppContext';
import walletSelectorStyles from './wselector.module.scss';
import Image from 'next/image';
import getWalletLogo from '../../lib/getWalletLogo';
import { CHAIN_ID, ERROR_MESSAGE } from '../../constants';
import { CURRENT_USER_QUERY } from '../SiteLayout';
import {COOKIE_CONFIG} from "../../apollo";
import SwitchNetwork from "../Shared/SwitchNetwork";
import consoleLog from "../../lib/consoleLog";

const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`

export const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`

function WalletSelector({ setHasProfile }) {
	const {data: accountData} = useAccount();
	const { setSelectedProfile, currentUser} = useContext(AppContext)
	const { signMessageAsync, isLoading: signLoading } = useSignMessage();
	const [
		loadChallenge,
		{ error: errorChallenge, loading: challengeLoading }
	] = useLazyQuery(CHALLENGE_QUERY, {
		fetchPolicy: 'no-cache',
		onCompleted(data) {
			consoleLog(
				'Lazy Query',
				'#8b5cf6',
				`Fetched auth challenge - ${data?.challenge?.text}`
			)
		}
	})
	const [authenticate, { error: errorAuthenticate, loading: authLoading }] =
		useMutation(AUTHENTICATE_MUTATION)
	const [getProfiles, { error: errorProfiles, loading: profilesLoading }] =
		useLazyQuery(CURRENT_USER_QUERY, {
			onCompleted(data) {
				consoleLog(
					'Lazy Query',
					'#8b5cf6',
					`Fetched ${data?.profiles?.items?.length} user profiles for auth`
				)
			}
		});
	const {connect, connectors, error, isConnecting, pendingConnector} =
		useConnect();

	const {activeChain} = useNetwork();

	const handleSign = () => {
		loadChallenge({
			variables: { request: { address: accountData?.address } }
		}).then((res) => {
			signMessageAsync({ message: res?.data?.challenge?.text }).then(
				(signature) => {
					localStorage.setItem('signature', JSON.stringify({
						sig: signature,
						address: accountData?.address,
						derivedVia: 'web3.eth.personal.sign',
						signedMessage: res?.data?.challenge?.text
					}))
					authenticate({
						variables: {
							request: { address: accountData?.address, signature }
						}
					}).then((res) => {
						Cookies.set(
							'accessToken',
							res.data.authenticate.accessToken,
							COOKIE_CONFIG
						)
						Cookies.set(
							'refreshToken',
							res.data.authenticate.refreshToken,
							COOKIE_CONFIG
						)
						getProfiles({
							variables: { ownedBy: accountData?.address }
						}).then((res) => {
							localStorage.setItem('selectedProfile', '0')
							if (res.data.profiles.items.length === 0) {
								setHasProfile(false)
							} else {
								setSelectedProfile(0)
								Router.push(`/u/${res.data.profiles.items[0].handle}`)
							}
						})
					})
				}
			)
		})
	}

	return accountData?.connector?.id ? (
		<div>
			{activeChain?.id === CHAIN_ID ? (
				<Button
					size="large"
					type="primary"
					disabled={
						signLoading || challengeLoading || authLoading || profilesLoading
					}
					loading = {signLoading ||
					challengeLoading ||
					authLoading ||
					profilesLoading}
					style={{verticalAlign: 'middle'}}
					onClick={handleSign}
				>
					<Icon component = {() => (!signLoading &&
						!challengeLoading &&
						!authLoading &&
						!profilesLoading && <Image
							priority
							src="/images/lens.png"
							height={20}
							width={20}
							alt="Lens logo"
							style={{display: 'inline-block', marginRight: '15px', }}
						/>)} />
					Sign-In with Lens
				</Button>
			) : (<SwitchNetwork />)}
			{(errorChallenge || errorAuthenticate || errorProfiles) && (
				<div>
					<div>{ERROR_MESSAGE}</div>
				</div>
			)}
		</div>
	) : (<div className={walletSelectorStyles.wselector}>
		{connectors.map((connector) => (
			<Button
				disabled={!connector.ready}
				key={connector.id}
				onClick={() => connect(connector)}
				loading={isConnecting &&
				connector.id === pendingConnector?.id}
				className={walletSelectorStyles.wbtn}
			>
				<span
					className={walletSelectorStyles.wicon}
				>
					<Image
						src={getWalletLogo(connector.name)}
						height={40}
						width={40}
						alt={connector.id}
					/>
				</span>
				<span>
					{connector.id === 'injected'
						? 'Browser Wallet'
						: connector.name}
					{!connector.ready && ' (unsupported)'}
				</span>
			</Button>
		))}


		{error && <div>{error.message}</div>}
	</div>)
}

export default WalletSelector
