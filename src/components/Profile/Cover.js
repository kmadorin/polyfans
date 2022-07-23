import Image from 'next/image';
import coverStyles from './cover.module.scss';
import {PUBLIC_URL} from "../../constants";

export default function Cover({cover}) {

	return (
		<div className={coverStyles.cover}>
			<Image
				src={cover ? cover : `${PUBLIC_URL}/images/default_cover.png`} alt='cover' layout="fill"
				objectFit="cover"
				objectPosition='50%'
			/>
		</div>
	)
}
