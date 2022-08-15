import { create } from 'ipfs-http-client'
import {INFURA_IPFS_API_SECRET_KEY, INFURA_IPFS_PROJECT_ID} from "../constants";

const auth = 'Basic ' + btoa(INFURA_IPFS_PROJECT_ID + ':' + INFURA_IPFS_API_SECRET_KEY);

const client = create({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
})


const loadBlobFromIPFS = async (blobPath) => {
	const fileContents = client.cat(blobPath);
	let result;

	for await (const chunk of fileContents) {
		result = new Blob([chunk], {
			type: "encryptedString.type", // or whatever your Content-Type is
		});
	}
	return result;
}

export default loadBlobFromIPFS
