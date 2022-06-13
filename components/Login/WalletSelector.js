import {useAccount, useNetwork, useConnect} from 'wagmi';
import {Button} from 'antd';
import walletSelectorStyles from './wselector.module.scss';
import Image from 'next/image';
import getWalletLogo from '../../utils/getWalletLogo';
import {Typography} from 'antd';

const {Text} = Typography;

function WalletSelector() {
	// const [mounted, setMounted] = useState(false);
	const {data: accountData} = useAccount();
	const {connect, connectors, error, isConnecting, pendingConnector} =
		useConnect();

	// useEffect(() => setMounted(true), []);

	console.log(`###: accountData`, accountData);

	return accountData?.connector?.id ? (
		<div className={walletSelectorStyles.wselector}>
			<Text>Connected</Text>
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
