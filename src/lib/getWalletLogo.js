import {PUBLIC_URL} from "../constants";

export default function getWalletLogo(name) {
	switch (name) {
		case 'WalletConnect':
			return `${PUBLIC_URL}/images/wallets/walletconnect.svg`
		case 'Coinbase Wallet':
			return `${PUBLIC_URL}/images/wallets/coinbase.svg`
		default:
			return `${PUBLIC_URL}/images/wallets/browser-wallet.svg`
	}
}
