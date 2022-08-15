import {create} from "ipfs-http-client";

const uploadAssetsToIPFS = async (data) => {
	const client = create({
		host: 'stage.fluence.dev',
		port: 15001,
		protocol: 'https'
	})

	try {
		const attachments = []
		for (let i = 0; i < data.length; i++) {
			let file = data.item(i)
			const formData = new FormData()
			formData.append('file', file, 'img')
			// console.log(`###: formData`, formData);

			// const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
			// 	method: 'POST',
			// 	body: formData
			// })
			const res = await client.add(file);
			console.log(`###: res`, res);
			const { cid } = await client.add(file)
			const pathCIDvv1 = cid.toV1();
			console.log(`###: pathCIDvv1`, pathCIDvv1.toString());
			// const path = 'bafybeihqj755nsynpsfllkhvdiuhb4kd2rjxkdx5rgzq67ygy5mztyoaca';
			attachments.push({
				item: `https://${pathCIDvv1}.ipfs.dweb.link`,
				type: file.type
			})
		}

		return attachments
	} catch {
		return []
	}
}

export default uploadAssetsToIPFS
