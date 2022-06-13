import dynamic from 'next/dynamic';
const WalletSelector = dynamic(() => import('./WalletSelector'), { ssr: false });

import loginStyles from './login.module.scss';

export default function Login() {
	return (
		<div className={loginStyles.login}>
			<h2 className={loginStyles.heading}>Join</h2>
			<WalletSelector/>
		</div>
	)
}
