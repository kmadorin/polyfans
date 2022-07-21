import LitJsSdk from 'lit-js-sdk';
import {Button} from 'antd';
import {useContext, useState} from "react";
import {useAccount, useSigner} from 'wagmi';
import LitContext from "./utils/LitContext";

export default function LitBtn() {
	const litClient = useContext(LitContext);
	const text = 'Hello Lit';
	const [encryptedMessage, setEncryptedMessage] = useState('');
	const [decryptedMessage, setDecryptedMessage] = useState('');
	const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState('');
	const [authSig, setAuthSig] = useState('');
	const {data: signer} = useSigner();
	const {data: accountData} = useAccount();

	const followNFTAddr = '0x9e0Ccc0D5E967EdE92fADB0F5c87b00c4cf2BBfB';


	const accessControlConditions = [
		{
			contractAddress: followNFTAddr,
			standardContractType: 'ERC721',
			chain: 'mumbai',
			method: 'balanceOf',
			parameters: [
				':userAddress',
			],
			returnValueTest: {
				comparator: '>',
				value: '0'
			}
		}
	]


	async function onEncrypt(e) {
		// const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'mumbai'})
		const authSig = JSON.parse(localStorage.getItem('signature'));
		setAuthSig(authSig);
		const {encryptedString, symmetricKey} = await LitJsSdk.encryptString(
			text
		);

		setEncryptedMessage(encryptedString);

		const encryptedSymmetricKey = await litClient.saveEncryptionKey({
			accessControlConditions,
			symmetricKey,
			authSig: authSig,
			chain: 'mumbai',
		});

		setEncryptedSymmetricKey(encryptedSymmetricKey)
	}

	async function onDecrypt(e) {
		const symmetricKey = await litClient.getEncryptionKey({
			accessControlConditions,
			toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
			authSig: authSig,
			chain: 'mumbai',
		})

		const decryptedString = await LitJsSdk.decryptString(
			encryptedMessage,
			symmetricKey
		);

		setDecryptedMessage(decryptedString);
	}

	return (
		<div>
			<b>Message:</b> {text}
			{/*<b>Encrypted Message:</b> {encryptedMessage}*/}
			<b>Decrypted Message:</b> {decryptedMessage}
			<Button type="primary" onClick={onEncrypt}>Encrypt</Button>
			<Button type="primary" onClick={onDecrypt}>Decrypt</Button>
		</div>
	)
}
