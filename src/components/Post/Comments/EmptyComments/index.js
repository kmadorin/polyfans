import {Empty} from 'antd';
import styles from './empty.module.scss';

export default function EmptyComments() {
	return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
		<span className={styles.text}>No comments yet. Be the first!</span>
	}>
	</Empty>)
}
