import WalletSelector from "./WalletSelector";
import {useState, useContext} from "react";
import {Typography} from 'antd';

const {Title, Text} = Typography;

import loginStyles from './login.module.scss';
import AppContext from "../utils/AppContext";
import {useAccount} from "wagmi";
import Create from "./Create";

export default function Login() {
	const [hasConnected, setHasConnected] = useState(false);
	const [hasProfile, setHasProfile] = useState(true);

	return (
		hasProfile ? (
			<div className={loginStyles.login}>
				<Title level={3} className={loginStyles.heading}>Join</Title>
				{hasConnected && (<div className={loginStyles.content}>
					<Title level={4}>Please sign the message.</Title>
					<Text>We&rsquo;ll use this signature to verify that you&rsquo;re the
						owner of this address.</Text>
				</div>)}
				<WalletSelector
					setHasConnected={setHasConnected}
					setHasProfile={setHasProfile}
				/>
			</div>
		) : (<div className={loginStyles.login}>
			<Create />
		</div>)
	)
}
