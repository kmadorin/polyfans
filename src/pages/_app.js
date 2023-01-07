import "../styles/variables.less";
import '../styles/globals.css';
import '../styles/fonts.css';

import {ApolloProvider} from '@apollo/client'
import client from '../apollo';
import SiteLayout from "../components/SiteLayout";
import LitContext from "../components/utils/LitContext";
import {SequenceConnector} from "../components/utils/SequenceConnector";


import {
	ALCHEMY_KEY,
	ALCHEMY_RPC,
	APP_NAME,
	CHAIN_ID,
	IS_MAINNET,
} from '../constants';

import {chain, configureChains, createClient, defaultChains, WagmiConfig} from 'wagmi';
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet'
import {InjectedConnector} from 'wagmi/connectors/injected'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'
import {alchemyProvider} from 'wagmi/providers/alchemy'
import LitJsSdk from "lit-js-sdk";

const {chains, provider} = configureChains(
	[IS_MAINNET ? chain.polygon : chain.polygonMumbai, chain.mainnet],
	[alchemyProvider({alchemyId: ALCHEMY_KEY})]
)


const connectors = () => {
	return [
		new SequenceConnector({
			chains,
			options: {
				network: 'mumbai',
				app: APP_NAME,
			},
		}),
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
				appName: APP_NAME,
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

const litClient = new LitJsSdk.LitNodeClient();
litClient.connect();

function App({Component, pageProps}) {
	return (
		<WagmiConfig client={wagmiClient}>
			<ApolloProvider client={client}>
				<LitContext.Provider value={litClient}>
					<SiteLayout litClient={litClient}>
						<Component {...pageProps} />
					</SiteLayout>
				</LitContext.Provider>
			</ApolloProvider>
		</WagmiConfig>
	)
}

export default App
