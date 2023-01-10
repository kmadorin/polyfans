import "../styles/variables.less";
import '../styles/globals.css';
import '../styles/fonts.css';

import { createReactClient, studioProvider, LivepeerConfig } from '@livepeer/react';
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
	LIVEPEER_KEY
} from '../constants';

import {configureChains, createClient, defaultChains, WagmiConfig} from 'wagmi';
import { polygon, polygonMumbai, mainnet } from '@wagmi/core/chains';

import {CoinbaseWalletConnector} from '@wagmi/core/connectors/coinbaseWallet'
import { InjectedConnector } from '@wagmi/core'
import {WalletConnectConnector} from '@wagmi/core/connectors/walletConnect'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import LitJsSdk from "lit-js-sdk";

const {chains, provider} = configureChains(
	[IS_MAINNET ? polygon : polygonMumbai, mainnet],
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

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_KEY }),
});

function App({Component, pageProps}) {
	return (
		<WagmiConfig client={wagmiClient}>
			<ApolloProvider client={client}>
				<LitContext.Provider value={litClient}>
					<LivepeerConfig client={livepeerClient}>
						<SiteLayout>
							<Component {...pageProps} />
						</SiteLayout>
					</LivepeerConfig>
				</LitContext.Provider>
			</ApolloProvider>
		</WagmiConfig>
	)
}

export default App
