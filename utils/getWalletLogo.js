export default function getWalletLogo(name) {
	switch (name) {
		case 'WalletConnect':
			return '/images/wallets/walletconnect.svg'
		case 'Coinbase Wallet':
			return '/images/wallets/coinbase.svg'
		default:
			return '/images/wallets/browser-wallet.svg'
	}
}
