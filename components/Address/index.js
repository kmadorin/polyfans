import styles from './address.module.css';

function Address({value, size = 'long'}) {
	let displayAddress = value.substr(0, 6);

	 if (size === "short") {
		displayAddress += "..." + value.substr(-4);
	} else if (size === "long") {
		displayAddress = value;
	}

	return (
		<span className={styles.address}>{displayAddress}</span>
	)
}

export default Address
