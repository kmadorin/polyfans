import Image from 'next/image';
import {PUBLIC_URL} from "../constants";

function Logo() {
	return (
		<Image
			priority
			src={`${PUBLIC_URL}/images/logo.svg`}
			height={25}
			width={120}
			alt="logo"
		/>
	)
}

export default Logo
