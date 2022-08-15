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


const uploadToIPFS = async (data) => {
	return await client.add(JSON.stringify(data))
}

export default uploadToIPFS
