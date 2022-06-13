import styles from './address.module.css';

function Address({value, size = 'long'}) {
	return (
		<span className={styles.address}>{value}</span>
	)
}

export default Address
