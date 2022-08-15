const getIPFSLink = (hash) => {
	const infuraIPFS = 'https://polyfans.infura-ipfs.io/ipfs/'

	return hash
		.replace(/^Qm[1-9A-Za-z]{44}/gm, `${infuraIPFS}${hash}`)
		.replace('https://ipfs.io/ipfs/', infuraIPFS)
		.replace('ipfs://', infuraIPFS)
}

export default getIPFSLink
