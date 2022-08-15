import {INFURA_IPFS_PROJECT_ID, INFURA_IPFS_API_SECRET_KEY} from "../constants";

const uploadAssetsToIPFS = async (data) => {
	try {
		const attachments = []
		for (let i = 0; i < data.length; i++) {
			let file = data.item(i)
			const formData = new FormData()
			formData.append('file', file, 'img')

			const auth = 'Basic ' + btoa(INFURA_IPFS_PROJECT_ID + ':' + INFURA_IPFS_API_SECRET_KEY);

			const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
				method: 'POST',
				body: formData,
				headers: { 'Authorization' : auth }
			})
			const { Hash } = await upload.json()
			attachments.push({
				item: `https://polyfans.infura-ipfs.io/ipfs/${Hash}`,
				type: file.type
			})
		}

		return attachments
	} catch {
		return []
	}
}

export default uploadAssetsToIPFS
