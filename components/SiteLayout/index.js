import {Layout} from 'antd';

const {Header, Footer, Content} = Layout;
import {Row, Col, Button} from 'antd';
import {useAccount, useNetwork, useConnect, useDisconnect} from 'wagmi';
import AppContext from '../../utils/AppContext';
import Address from '../Address';
import Logo from '../Logo';
import layoutStyles from './layout.module.scss';
import {useEffect, useState} from "react";


function SiteLayout({children}) {
	const [mounted, setMounted] = useState(false);
	const {data: accountData} = useAccount();
	const {disconnect} = useDisconnect();
	const accountAddress = accountData && accountData.address;

	useEffect(() => setMounted(true), []);

	const injectedGlobalContext = {
		userAddress: undefined
	}

	const {connect, connectors, error, isConnecting, pendingConnector} =
		useConnect();

	return (
		<AppContext.Provider value={injectedGlobalContext}>
			<Layout style={{minHeight: '100vh'}} className={layoutStyles.layout}>
				<Header className={layoutStyles.header}>
					<Row justify="space-between" align="middle" className={layoutStyles.row}>
						<Col className={layoutStyles.logocol}>
							<Logo/>
						</Col>
						<Col>
							{mounted && accountAddress && (
								<>
									<Address value={accountAddress}/>
									<Button type="primary" onClick={disconnect} className={layoutStyles.logout}>Log out</Button>
								</>
							)}
						</Col>
					</Row>
				</Header>
				<Content>
					{children}
				</Content>
				{/*<Footer>Footer</Footer>*/}
			</Layout>
		</AppContext.Provider>
	)
}

export default SiteLayout
