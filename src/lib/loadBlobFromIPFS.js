import { create } from 'ipfs-http-client'

const client = create({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https'
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
