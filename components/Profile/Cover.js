import Image from 'next/image';
import coverStyles from './cover.module.scss';

export default function Cover({cover}) {
	return (
		<div className={coverStyles.cover}>
			<Image
				src={cover ? cover : '/images/default_cover.jpg'} alt='cover' layout="fill"
				objectFit="cover"
				objectPosition='50%'
			/>
		</div>
	)
}
