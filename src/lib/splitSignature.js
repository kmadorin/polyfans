import { utils } from 'ethers';

const splitSignature = (signature) => {
	return utils.splitSignature(signature)
}

export default splitSignature
