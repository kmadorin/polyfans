import "../styles/variables.less";
import '../styles/antd-custom.css';
import '../styles/globals.css';
import '../styles/fonts.css';

import { ApolloProvider } from '@apollo/client'
import client from '../apollo';
import SiteLayout from "../components/SiteLayout";

import {
	ALCHEMY_KEY,
	ALCHEMY_RPC,
	CHAIN_ID,
	IS_MAINNET,
	IS_PRODUCTION
} from '../constants';

import {chain, configureChains, createClient, WagmiConfig} from 'wagmi';
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet'
import {InjectedConnector} from 'wagmi/connectors/injected'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'
import {alchemyProvider} from 'wagmi/providers/alchemy'

const {chains, provider} = configureChains(
	[IS_MAINNET ? chain.polygon : chain.polygonMumbai, chain.mainnet],
	[alchemyProvider({alchemyId: ALCHEMY_KEY})]
)

const connectors = () => {
	return [
		new InjectedConnector({
			chains,
			options: {shimDisconnect: true}
		}),
		new WalletConnectConnector({
			chains,
			options: {
				rpc: {[CHAIN_ID]: ALCHEMY_RPC}
			}
		}),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: 'Polyfans',
				jsonRpcUrl: ALCHEMY_RPC
			}
		})
	]
}

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
})


function App({Component, pageProps}) {
	return (
		<WagmiConfig client={wagmiClient}>
			<ApolloProvider client={client}>
				<SiteLayout>
					<Component {...pageProps} />
				</SiteLayout>
			</ApolloProvider>
		</WagmiConfig>
	)
}

export default App
