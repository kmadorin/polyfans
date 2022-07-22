// import WalletSelector from "../components/Login/WalletSelector";
import dynamic from 'next/dynamic';
const WalletSelector = dynamic(() => import('../components/Login/WalletSelector'), { ssr: false })

export default function SignUp() {
	return (
		<div>
			<WalletSelector />
		</div>
	)
}
