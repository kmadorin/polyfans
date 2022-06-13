import Image from 'next/image';

function Logo() {
	return (
		<Image
			priority
			src="/images/logo.svg"
			height={25}
			width={120}
			alt="logo"
		/>
	)
}

export default Logo
