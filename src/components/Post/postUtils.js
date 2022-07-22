import getIPFSLink from "../../lib/getIPFSLink";
import LitJsSdk from "lit-js-sdk";
import loadBlobFromIPFS from '../../lib/loadBlobFromIPFS';

export function parsePostContent(post) {

	const title = post?.metadata?.attributes.find(attr => attr.traitType === 'title').value;
	const followers_only = post?.metadata?.attributes.find(attr => attr.traitType === 'followers_only').value;
	const coverImg = post?.metadata?.media.length > 0 && post?.metadata?.media[0].original.url;
	const coverImgURL = coverImg ? getIPFSLink(coverImg) : null;
	const content = post?.metadata?.content;

	let encryptedContent = followers_only ? post?.metadata?.attributes.find(attr => attr.traitType === 'encoded_post_data').value : '';

	return {
		coverImgURL,
		title,
		content,
		followers_only,
		encryptedContent
	}
}

export async function decryptContent(encryptedContent, litClient, authSig) {
	const {accessControlConditions, encryptedSymmetricKeyString, encryptedContentLink} = JSON.parse(encryptedContent);

	const encryptedBlob = await loadBlobFromIPFS(encryptedContentLink);

	const encryptionParams = {
		accessControlConditions,
		toDecrypt: encryptedSymmetricKeyString,
		authSig,
		chain: 'mumbai',
	}

	const symmetricKey = await litClient.getEncryptionKey(encryptionParams);

	return await LitJsSdk.decryptString(
		encryptedBlob,
		symmetricKey
	);
}
