import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import SiteLayout from '../components/SiteLayout';

const Login = dynamic(() => import('../components/Login'), {ssr: false});

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Polyfans</title>
				<meta name="description" content="A decentralized version of Patreon for web3 creators and their fans"/>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<div>
				<Login />
			</div>
		</div>
	)
}

Home.getLayout = function getLayout(page) {
  return (
    <SiteLayout>
      {page}
    </SiteLayout>
  )
}
