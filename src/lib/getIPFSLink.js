import { IPFS_GATEWAY } from '../constants';

const getIPFSLink = (hash) => {
	const gateway = IPFS_GATEWAY;
	
	return hash
		.replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}${hash}`)
		.replace('https://lens.infura-ipfs.io/ipfs/', gateway)
		.replace('https://ipfs.io/ipfs/', IPFS_GATEWAY)
		.replace('ipfs://', IPFS_GATEWAY)
}

export default getIPFSLink
