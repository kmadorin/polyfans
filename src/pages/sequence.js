import {sequence} from '0xsequence';
import {useEffect} from "react";
import {APP_NAME} from "../constants";

export default function SequencePage() {
	const network = 'mumbai';
	useEffect(() => {
		sequence.initWallet(network, { networkRpcUrl: 'https://matic-mumbai.chainstacklabs.com' })
			.then((wallet) => {
				console.log(`###: wallet`, wallet);
				return wallet.connect({app: APP_NAME, authorize: true})
			})
			.then(res => console.log(`###: res`, res));
	});

	return <div>
		Sequence integration test page
	</div>
}
